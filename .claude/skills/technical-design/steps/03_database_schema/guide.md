# DBML Conventions

How to write the database schema file for a project. Covers DBML syntax, commenting patterns, and the relationship to the project's data model.

---

## Overview

The database schema is a single **DBML file** (`schema.dbml`) that defines every persistent entity the application needs — tables, columns, types, relationships, indexes, and constraints. It is the source of truth for the data model.

DBML (Database Markup Language) is a human-readable DSL for documenting database structures. It is not executed directly — it serves as a clear, reviewable specification that developers and AI agents can reference when building the backend.

This step produces a single artifact file — no JSON data is needed.

---

## File Conventions

### Output

The step produces exactly one file:

```
schema.dbml
```

There is no `data.json` for this step. The DBML file is the sole artifact.

### Header

Start the file with a comment block identifying the project and database engine:

```dbml
// {Project Name} Database Schema ({Engine})
//
// {Brief description of the data model's philosophy or scope.}
```

The header sets context for anyone reading the file — which project, which database, and any high-level design rationale.

---

## DBML Syntax

### Tables

```dbml
Table table_name {
  column_name  type  [constraints, note: 'Explanation']
}
```

Key rules:
- **Table names** — lowercase `snake_case`, plural for collections (`users`, `projects`, `settings`)
- **Column names** — lowercase `snake_case`
- **Types** — use the target database's native types (`text`, `integer`, `boolean`, `timestamp`, etc.)
- **Align columns** — pad type and constraint columns for readability

### Column constraints

Use DBML's bracket syntax for constraints and metadata:

| Constraint | Syntax | Usage |
|------------|--------|-------|
| Primary key | `[pk]` | Every table needs one |
| Not null | `[not null]` | Required fields |
| Unique | `[unique]` | Fields that must be distinct |
| Default | `[default: value]` | Default values |
| Note | `[note: 'text']` | Explain purpose or behavior |

Combine multiple constraints in one bracket: `[pk, not null, note: 'UUID v4']`

### Notes on tables

Use DBML's `Note` block inside a table for longer explanations:

```dbml
Table table_name {
  // columns...

  Note: '''
    Multi-line explanation of the table's role,
    what it stores, and any important design decisions.
  '''
}
```

Table notes should answer: what does this table represent, and what design decisions shaped it?

### Relationships

Define relationships after the tables they reference:

```dbml
Ref: orders.user_id > users.id          // many-to-one
Ref: users.id - profiles.user_id        // one-to-one
Ref: students.id <> courses.id          // many-to-many
```

Alternatively, use inline references in column definitions:

```dbml
Table orders {
  user_id  integer  [ref: > users.id, not null]
}
```

### Indexes

Define indexes inside the table block:

```dbml
Table events {
  id          integer  [pk]
  user_id     integer  [not null]
  created_at  timestamp  [not null]

  indexes {
    user_id
    (user_id, created_at)  [name: 'idx_events_user_date']
  }
}
```

Add indexes for columns used in WHERE clauses, JOINs, or ORDER BY. Don't index everything — add them when performance needs justify it.

### Enums

Define enums for columns with a fixed set of values:

```dbml
Enum status {
  draft
  active
  archived
}

Table projects {
  status  status  [not null, default: 'draft']
}
```

---

## Commenting Conventions

### Section dividers

Separate logical groups of tables with visual dividers:

```dbml
// ─────────────────────────────────────────────────────────────────────
//  SECTION NAME
// ─────────────────────────────────────────────────────────────────────
```

Group tables by domain — authentication, content, billing, etc. This makes the file scannable.

### Non-table entities

If the project stores certain data outside the database (files on disk, external services, etc.), document them as comment blocks between the relevant sections:

```dbml
// ─────────────────────────────────────────────────────────────────────
//  ENTITY NAME
// ─────────────────────────────────────────────────────────────────────
//
//  Not a table — {brief explanation of where and how this data is
//  stored}. Documented here for completeness so the full data model
//  is visible in one place.
//
// ─────────────────────────────────────────────────────────────────────
```

This keeps the schema file as the single reference for the project's entire data model, even when some entities live outside the database.

### Design rationale

Use a closing comment block to document overarching design decisions — why the schema is shaped the way it is, trade-offs that were made, or principles that guided the model:

```dbml
// ─────────────────────────────────────────────────────────────────────
//  DESIGN RATIONALE
// ─────────────────────────────────────────────────────────────────────
//
//  {Explanation of key design decisions, trade-offs, and principles.}
//
// ─────────────────────────────────────────────────────────────────────
```

---

## Content Approach

### Use real project data

Draw the schema from the project's earlier steps — architecture decisions, API design, feature definitions. Every table should trace back to a concrete requirement. No speculative tables.

### Model what the project needs

Only define tables the application will actually use. Don't add tables for "future flexibility" or because a pattern seems standard. If the project doesn't need user roles, don't add a roles table.

### Annotate generously

Every column should have a `note` unless its purpose is obvious from the name. Table-level `Note` blocks should explain the table's role. Future-you (and AI agents) will read this file without other context — make it self-documenting.

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use one schema file per project | Split the schema across multiple files |
| Group tables by domain with section dividers | Dump all tables in an unorganized list |
| Annotate columns with `note` constraints | Leave columns unexplained |
| Document non-DB entities as comment blocks | Omit entities that live outside the database |
| Use the target database's native types | Use abstract or ORM-specific types |
| Add indexes for queried columns | Index every column or skip indexes entirely |
| Derive tables from project requirements | Add speculative tables for hypothetical features |
| Include a design rationale section | Leave the reader guessing about trade-offs |

---

## Workflow Summary

When creating or updating the schema:

1. **Read the project's architecture and API design** for data requirements
2. **Identify entities** — what needs to be stored, and where (DB vs. filesystem vs. external)
3. **Define tables** with columns, types, constraints, and notes
4. **Add relationships** between tables
5. **Add indexes** for performance-critical queries
6. **Document non-table entities** as comment blocks
7. **Add a design rationale** explaining key decisions
