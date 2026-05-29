# Team Profiles — Big-Tech Roles (and their Claude mapping)

> Each role is a **lens of responsibility**. In our setup each can also become a **subagent persona** with its own context, tools, and (optionally) memory — modeling the org as a fleet of specialists.

## Core engineering roles

| Role | Owns | Key questions it asks | Claude mapping |
|---|---|---|---|
| **Product Owner / Manager** | The "what" & "why", backlog priority | Is this the right thing to build? | Story/AC drafting from design doc |
| **Architect / Tech Lead** | System design, boundaries, tradeoffs, standards | Where does complexity live? Will this rot? | Plan-mode partner; design-review subagent |
| **Software Engineer (Dev)** | Implementation against spec | Does it meet the spec correctly & cleanly? | The robust-code loop (`02`) |
| **QA / Test Engineer (SDET)** | Test strategy, coverage, edge cases | How does this break? What's untested? | Test-author + adversarial-tester subagent |
| **DevOps / Platform / SRE** | CI/CD, IaC, deploy, reliability, on-call | Is it reproducible, observable, recoverable? | Hooks + headless reasoning on pipeline events |
| **Security Engineer (AppSec)** | Threat model, vulns, secrets, authz | What's the attack surface? | `/security-review`; PreToolUse deny gates |
| **Data / ML Engineer** | Pipelines, models, data quality | Is the data correct & governed? | Schema/pipeline subagents |

## Supporting roles

| Role | Owns | Claude mapping |
|---|---|---|
| **Engineering Manager** | People, delivery, process health | Retro/metrics synthesis |
| **Designer (UX/UI)** | Interaction & visual design | `frontend-design` skill |
| **Release Manager** | Versioning, changelog, rollout | Changelog from commits |
| **Technical Writer** | Docs, runbooks, ADRs | Doc generation/upkeep |

## Mapping roles → subagents

The architect's move: turn each role into a **specialized subagent** with scoped tools and a persistent memory dir.

```
.claude/agents/
  architect.md        # design review, boundary checks — read-heavy, capable model
  tester.md           # adversarial test authoring — finds edge cases
  devops.md           # CI/CD, IaC, deploy reasoning
  security.md         # threat model, secret/authz review
  reviewer.md         # PR review against our conventions
```

- **Separation of concerns**: each agent has one responsibility and only the tools it needs.
- **Model routing**: capable model for architect/security reasoning; cheaper/faster for grunt scans.
- **Memory**: role agents accumulate knowledge across sessions in their own dir.
- **Orchestration**: a workflow can fan these out (e.g. dev → tester → security → reviewer) like a real review board.

## One person, many hats

Solo or small team: *you* play PO + architect + dev, and lean on the subagent fleet to cover tester / devops / security / reviewer — getting Big-Tech role coverage without Big-Tech headcount.
