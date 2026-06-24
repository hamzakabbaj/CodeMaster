// CodeMaster build-critique workflow (CM-66) — the critique beat of the build loop.
// Reviews the CURRENT BRANCH DIFF through role lenses, then ADVERSARIAL
// VERIFICATION: each finding is challenged by skeptics that try to refute it; only
// survivors are reported. Lenses are conditional on risk flags the build skill
// passes (test-designer always; security if risky; architect if gnarly). The
// test-designer lens also proposes concrete tests to add.
//
// INLINE role prompts (no custom fleet dependency) so it rides into Track B/C repos
// — the same portability rationale as review-board (CM-23/24), whose skeptic core
// this reuses. Run from the build loop's critique beat at a green point:
//
//   Workflow({ scriptPath: ".../.claude/workflows/build-critique.mjs",
//              args: { base: "main", risky: false, gnarly: false } })
//
// Cost routing (docs/04): sonnet to review, haiku for the skeptic swarm.

export const meta = {
  name: 'build-critique',
  description: 'Review the branch diff through test-designer/security/architect lenses with adversarial verification; returns surviving findings + proposed tests.',
  phases: [
    { title: 'Review', detail: 'one agent per active lens (sonnet)' },
    { title: 'Verify', detail: 'haiku skeptics try to refute each finding' },
  ],
}

const base = (args && args.base) || 'main'
const risky = !!(args && args.risky)
const gnarly = !!(args && args.gnarly)
const VERIFY_TOP = 3 // cap findings verified per lens (bounded run; logged)
const SKEPTICS = 2 // adversarial verifiers per finding
const majority = Math.floor(SKEPTICS / 2) + 1 // kill a finding if >= this many refute

// Diff scope: everything this branch introduced, committed OR working-tree.
const DIFF = `git diff $(git merge-base ${base} HEAD)`

// Lenses built from the flags — proportionate to risk. Prompts inlined for portability.
const LENSES = [
  { key: 'test-designer', tests: true,
    lens: 'edge cases, boundary inputs, error paths, and behaviours the acceptance criteria miss' },
  ...(risky ? [{ key: 'security',
    lens: 'injection, secrets, untrusted input, unsafe quoting, authz, blast radius' }] : []),
  ...(gnarly ? [{ key: 'architect',
    lens: 'wrong-layer choices, coupling, abstractions that will rot, simpler alternatives' }] : []),
]

log(`build-critique: ${DIFF} · lenses=[${LENSES.map((l) => l.key).join(', ')}]`)

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
    proposed_tests: { type: 'array', items: { type: 'string' } }, // test-designer lens only
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

const perLens = await pipeline(
  LENSES,
  // Stage 1 — review the diff through this lens.
  (l) =>
    agent(
      `Run \`${DIFF}\` and review ONLY the changed code through the ${l.key.toUpperCase()} lens (${l.lens}). Apply CodeMaster doctrine (CLAUDE.md, docs/). Report only real, specific, actionable findings, each with a location + severity; if clean on this lens return an empty findings array — do not invent problems.${l.tests ? ' Also list concrete tests that SHOULD exist for this change in proposed_tests.' : ''}`,
      { label: `review:${l.key}`, phase: 'Review', schema: FINDINGS, model: 'sonnet' },
    ),
  // Stage 2 — adversarially verify each finding; carry proposed_tests through unchanged.
  (review, l) => {
    const found = ((review && review.findings) || []).slice(0, VERIFY_TOP)
    const tests = (review && review.proposed_tests) || []
    const all = (review && review.findings) || []
    if (all.length > found.length) log(`  ${l.key}: verifying top ${found.length}/${all.length} (bounded)`)
    return parallel(
      found.map((f) => () =>
        parallel(
          Array.from({ length: SKEPTICS }, (_unused, i) => () =>
            agent(
              `Skeptic #${i + 1}. A ${l.key} review of the branch diff (vs ${base}) claims: "${f.title}" — ${f.detail} (at ${f.location || 'unspecified'}). Run \`${DIFF}\` and TRY TO REFUTE this claim. Set refuted=true if it is not clearly a real, actionable problem. Default refuted=true when uncertain.`,
              { label: `verify:${l.key}#${i + 1}`, phase: 'Verify', schema: VERDICT, model: 'haiku' },
            ),
          ),
        ).then((votes) => {
          const refutes = votes.filter(Boolean).filter((v) => v.refuted).length
          return { ...f, lens: l.key, survives: refutes < majority }
        }),
      ),
    ).then((verified) => ({ lens: l.key, verified, proposed_tests: tests }))
  },
)

const results = perLens.filter(Boolean)
const confirmed = results.flatMap((r) => (r.verified || []).filter(Boolean).filter((f) => f.survives))
const proposedTests = results.flatMap((r) => r.proposed_tests || [])
const considered = results.reduce((n, r) => n + (r.verified ? r.verified.length : 0), 0)
log(`build-critique: ${confirmed.length}/${considered} findings survived · ${proposedTests.length} tests proposed`)
return { base, considered, confirmed, proposed_tests: proposedTests }
