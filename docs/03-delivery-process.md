# Delivery Process — From Approved Design to Production

> Assumes the **Design Thinking phase is done**: problem framed, solution shaped, scope agreed. This doc covers turning that into shipped, operated software the Big-Tech way.

## Pipeline overview

```
Design (done) → Backlog → Sprint → Branch → Build+Verify → PR/Review → CI/CD → Release → Observe → Iterate
```

## 1. Agile / ticketing

- **Epic** per design outcome → **Stories** (user-visible value) → **Tasks** (technical steps) → optional **Spikes** (research).
- Every story carries: **acceptance criteria**, estimate, owner, Definition of Ready / Done.
- Ceremonies: backlog refinement, sprint planning, daily standup, review, retro.
- Convention: ticket ID (e.g. `PROJ-123`) is the thread that links commit → branch → PR → release notes.

## 2. Git workflow

- **Trunk-based** with short-lived feature branches: `feat/PROJ-123-short-desc`.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:` — drives changelogs & semver.
- Commit messages reference the ticket. Small, atomic, green commits (checkpoints).
- Branch protection: no direct push to `main`; PR + passing checks + review required.

## 3. Pull request & review

- PR template: what/why, ticket link, test evidence, risk, rollback plan.
- **Automated review first** (lint, types, tests, security scan, AI review), human review second.
- Reviewer focuses on design/security/perf — the machine already caught the mechanical stuff.

## 4. CI/CD

- **CI** on every push/PR: install → lint → typecheck → test → build → security scan → coverage gate.
- **CD**: merge to `main` → build artifact → deploy to staging → smoke tests → promote to prod.
- Strategies: feature flags, blue-green / canary, automated rollback on SLO breach.
- **IaC** (Terraform/Pulumi) — environments are reproducible, reviewed like code.

## 5. Quality & security gates (deterministic)

- Coverage threshold, no high-severity vulns (SCA/SAST), no secrets (scanner), license check.
- These are **blocking** — encoded in CI, not left to reviewer goodwill.

## 6. Release management

- **Semantic versioning** + auto-generated changelog from commits.
- Tagged releases, release notes link tickets, migration notes for breaking changes.

## 7. Observability & operations

- **Logs, metrics, traces** (the three pillars) wired in before release.
- SLIs/SLOs defined; alerting on error budget burn.
- Incident process: on-call, runbooks, blameless postmortems → feed actions back into the backlog.

## 8. Where Claude Code plugs in

| Stage | Claude leverage |
|---|---|
| Backlog | Draft stories/acceptance criteria from the design doc |
| Build | The robust-code loop (see `02`) |
| Review | Automated PR review (headless agent in CI) |
| CI/CD | Hooks + headless reasoning on pipeline events |
| Release | Generate changelog/release notes from commits |
| Observe | Triage logs/incidents via subagents; draft postmortems |
| Org-wide | **Plugin** encoding these gates & conventions, installed by every engineer |

## Definition of Done (delivery)

- [ ] Ticket acceptance criteria met & verified
- [ ] PR merged via review + green CI
- [ ] Deployed through staging → prod with rollback ready
- [ ] Observability in place, SLOs defined
- [ ] Release notes / docs updated; ticket closed
