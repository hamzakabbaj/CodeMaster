---
name: db-docs
description: Document the project's database schema as it actually is — a schema.dbml plus a README for what DBML can't hold — in .codemaster/docs/database/, and keep it in sync with the code. Use to create the schema docs, to refresh them after a schema change (build calls it when a branch touches the schema), or when someone asks what the database looks like.
argument-hint: "[--check]   (no flag: create or refresh · --check: report drift, write nothing)"
allowed-tools: Bash, Read, Glob, Grep, Write, Edit
---

You maintain the **as-built** documentation of the project's one database: what the schema *is* in
the code today — not the design intent (`technical-design` owns that, before development starts).
The docs are **derived from the code, never from memory**, and they're committed next to the change
that caused them, so they're reviewed in the same PR.

## Where the docs live (committed)

```
.codemaster/docs/database/
  schema.dbml     tables, columns, indexes, refs, enums, checks — each with a note where it helps
  README.md       everything DBML can't hold, and the "why" behind the schema
```

Unlike the backlog, these are **product docs — committed to git**, never gitignored.

## 1. Find the schema's source of truth

Read `.codemaster/config.json` → `database.sources`: the repo files that define the schema. If it's
absent (first run), **find them** — don't ask for what you can read:

| Stack | Typical source |
|---|---|
| Prisma | `prisma/schema.prisma` |
| Drizzle / TypeORM / Sequelize | the schema/entity/model files, or their migrations |
| SQLAlchemy + Alembic | the models + `alembic/versions/` |
| Django | `*/models.py` + `*/migrations/` |
| Rails | `db/schema.rb` (or `db/structure.sql`) |
| Raw SQL | `migrations/*.sql`, `schema.sql`, `db/*.sql` |

Prefer the **most complete** source: a generated full-schema file (`schema.prisma`, `schema.rb`,
`structure.sql`) beats replaying migrations one by one. Show the user what you found, then record it:

```json
{ "database": { "sources": ["prisma/schema.prisma", "prisma/migrations/"] } }
```

These paths are also how `build` and `ship` recognise a schema change — keep them tight (the files
that define the schema, not the whole backend). If there is **no database** in the repo, say so and
stop; don't create empty docs.

## 2. Write `schema.dbml`

Translate the sources into DBML, **faithfully**:
- Start with `Project <name> { database_type: '<PostgreSQL|MySQL|SQLite|…>' }`.
- Every table and column with its real type and settings (`pk`, `not null`, `unique`, `default`,
  `increment`, `check`). Enums, foreign keys (`ref:` with `delete:`/`update:` actions), and **every
  index** in an `Indexes { }` block — composite, unique, `type: btree|hash`, and its real `name`.
- Use `schema.table` names if the database uses schemas beyond the default.
- **Never invent.** If the source doesn't say (a type the ORM leaves to the database, an index only a
  migration creates), look it up in the source; if it's truly unknowable from the repo, write
  `note: 'unverified — …'` rather than guessing.

**Refreshing an existing file: update, don't rewrite.** Regenerate the structure from the sources, but
**carry over every existing `note`** on tables, columns, and indexes that still exist. The notes are
the human knowledge; the structure is the part that must match the code.

## 3. Write `README.md` — what DBML can't hold

DBML has no syntax for **views, materialized views, triggers, functions/stored procedures,
sequences, extensions, row-level security policies, or partitions.** Document the ones the database
actually has — skip a section if there's nothing in it:

```markdown
# Database — <name> (<engine>)

Schema source: `<sources>` · How to change it: <how migrations are created and run here>

## Views · Triggers · Functions · Sequences · Extensions · RLS policies · Partitions
<one short entry each: name, what it does, where it's defined>

## Why it's shaped this way
<notable indexes (the query they serve), non-obvious constraints, soft deletes, multi-tenancy,
 naming conventions, data-lifecycle rules>
```

The same refresh rule applies: keep existing explanations that are still true; fix or remove the
ones the change made wrong.

## 4. Validate — for real

Check the DBML parses. `dbml2sql` **exits 0 even on a broken file** — it prints `ERROR:` and writes a
`dbml-error.log` — so check the output, not the exit code:

```sh
out=$(npx -y -p @dbml/cli dbml2sql .codemaster/docs/database/schema.dbml --postgres 2>/dev/null)
rm -f dbml-error.log
printf '%s' "$out" | grep -q 'ERROR:' && { printf '%s\n' "$out" | grep -A1 'ERROR:'; echo "INVALID"; } || echo "valid"
```

(Use `--mysql` / `--mssql` to match the engine.) Fix and re-run until it's valid. If `npx` isn't
available, say the file is unvalidated — don't claim it's valid.

## 5. Report

Say what the docs cover (tables, indexes, enums, and which non-DBML objects), what **changed** since
the last version (`git diff --stat .codemaster/docs/database/`), and anything marked `unverified`.
When called from `build`, the changed docs are committed **with** the schema change — same
checkpoint, same PR.

## `--check` — drift report, no writes

Compare the docs to the current sources and report: tables, columns, indexes, enums, or non-DBML
objects that exist in one but not the other. `in sync` or a list of differences. Used by `ship`, and
handy before a review.

## Guardrails
- **Derived from the code, never from memory** — and never from a live database connection unless
  the user explicitly provides one.
- **One database per repo.** Everything lives in `.codemaster/docs/database/`.
- **Don't touch the schema itself.** This skill documents; migrations and models belong to `build`.
