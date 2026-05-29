// CodeMaster review-board workflow (CM-23/24).
// Multi-dimension review of a target, then ADVERSARIAL VERIFICATION: each
// finding is challenged by skeptics that try to refute it; only survivors are
// reported. Self-contained (inline role prompts) so it runs without the custom
// fleet registered and is portable to Track B/C repos.
//
// Run:  Workflow({ scriptPath: ".../.claude/workflows/review-board.mjs",
//                  args: { target: "scripts/roadmap_stats.py" } })
//
// Bounded by design: few dimensions, capped findings/dimension, cheap models.
// Cost routing (docs/04): sonnet to review, haiku for the skeptic swarm.

export const meta = {
  name: 'review-board',
  description: 'Multi-dimension code review with adversarial verification; reports only findings that survive skeptics.',
  phases: [
    { title: 'Review', detail: 'one agent per review dimension (sonnet)' },
    { title: 'Verify', detail: 'haiku skeptics try to refute each finding' },
  ],
}

const target = (args && args.target) || 'scripts/roadmap_stats.py'
const VERIFY_TOP = 2 // cap findings verified per dimension (bounded run; logged)
const SKEPTICS = 2 // adversarial verifiers per finding
const majority = Math.floor(SKEPTICS / 2) + 1 // kill a finding if >= this many refute

const DIMENSIONS = [
  { key: 'correctness', lens: 'logic errors, edge cases, off-by-one, error handling, idempotency' },
  { key: 'security', lens: 'injection, secrets, untrusted input, unsafe quoting, authz/blast radius' },
  { key: 'design', lens: 'wrong-layer choices, coupling, abstractions that will rot, simpler alternatives' },
]

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'nit'] },
          location: { type: 'string' },
          detail: { type: 'string' },
        },
        required: ['title', 'severity', 'detail'],
      },
    },
  },
  required: ['findings'],
}

const VERDICT = {
  type: 'object',
  properties: {
    refuted: { type: 'boolean' },
    reason: { type: 'string' },
  },
  required: ['refuted', 'reason'],
}

log(`review-board: target=${target} (${DIMENSIONS.length} dimensions, ${SKEPTICS} skeptics/finding)`)

const perDimension = await pipeline(
  DIMENSIONS,
  (d) =>
    agent(
      `Read the file \`${target}\` in this repo and review it through the ${d.key.toUpperCase()} lens (${d.lens}). Apply CodeMaster doctrine (CLAUDE.md, docs/). Report only real, specific, actionable findings with a location and severity. If the file is clean on this lens, return an empty findings array — do not invent problems.`,
      { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS, model: 'sonnet' },
    ),
  (review, d) => {
    const found = (review && review.findings) || []
    const top = found.slice(0, VERIFY_TOP)
    if (found.length > top.length) log(`  ${d.key}: verifying top ${top.length}/${found.length} (bounded)`)
    return parallel(
      top.map((f) => () =>
        parallel(
          Array.from({ length: SKEPTICS }, (_unused, i) => () =>
            agent(
              `Skeptic #${i + 1}. A ${d.key} review of \`${target}\` claims: "${f.title}" — ${f.detail} (at ${f.location || 'unspecified'}). Read the file and TRY TO REFUTE this claim. If it is not clearly a real, actionable problem, set refuted=true. Default refuted=true when uncertain.`,
              { label: `verify:${d.key}#${i + 1}`, phase: 'Verify', schema: VERDICT, model: 'haiku' },
            ),
          ),
        ).then((votes) => {
          const refutes = votes.filter(Boolean).filter((v) => v.refuted).length
          return { ...f, dimension: d.key, refutes, survives: refutes < majority }
        }),
      ),
    )
  },
)

const all = perDimension.flat().filter(Boolean)
const confirmed = all.filter((f) => f.survives)
log(`review-board: ${confirmed.length}/${all.length} findings survived adversarial verification`)
return { target, considered: all.length, confirmed }
