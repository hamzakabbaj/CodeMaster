#!/usr/bin/env node
/*
 * Blueprint schema-conformance check (verification ladder rung).
 *
 * Every blueprint `data.json` produced by the design-thinking / technical-design
 * skills is supposed to validate against that step's `schema.json`. Nothing
 * enforced that — this rung does. Dependency-free (no ajv): the skills use a
 * small, fixed subset of JSON Schema (type, required, properties, items, enum,
 * additionalProperties), so we validate exactly that subset.
 *
 * Scope: examples/<project>/blueprint/<version>/{design-thinking,system-design}/<step>/data.json
 * Rules:
 *   - No matching schema (guide-only steps: wireframing, database_schema,
 *     design_system) -> skipped.
 *   - Empty object `{}` (an intentionally-unfilled stub) -> skipped.
 *   - Otherwise -> validated; any violation fails the rung.
 *
 * Exit 0 = all good, exit 1 = at least one violation.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL_STEP_DIRS = {
  'design-thinking': path.join(ROOT, '.claude/skills/design-thinking/steps'),
  'system-design': path.join(ROOT, '.claude/skills/technical-design/steps'),
};

// step-folder-name -> schema.json path (only steps that actually have a schema)
function buildSchemaMap(dir) {
  const map = {};
  if (!fs.existsSync(dir)) return map;
  for (const entry of fs.readdirSync(dir)) {
    const m = entry.match(/^\d+_(.+)$/);
    if (!m) continue;
    const schemaPath = path.join(dir, entry, 'schema.json');
    if (fs.existsSync(schemaPath)) map[m[1]] = schemaPath;
  }
  return map;
}
const SCHEMA_MAPS = {
  'design-thinking': buildSchemaMap(SKILL_STEP_DIRS['design-thinking']),
  'system-design': buildSchemaMap(SKILL_STEP_DIRS['system-design']),
};

function typeOk(val, t) {
  switch (t) {
    case 'object': return val !== null && typeof val === 'object' && !Array.isArray(val);
    case 'array': return Array.isArray(val);
    case 'string': return typeof val === 'string';
    case 'integer': return typeof val === 'number' && Number.isInteger(val);
    case 'number': return typeof val === 'number';
    case 'boolean': return typeof val === 'boolean';
    case 'null': return val === null;
    default: return true;
  }
}

// Validate `data` against `schema`, pushing "path: message" strings into `errs`.
function validate(data, schema, p, errs) {
  if (schema.type && !typeOk(data, schema.type)) {
    errs.push(`${p}: expected ${schema.type}, got ${Array.isArray(data) ? 'array' : data === null ? 'null' : typeof data}`);
    return; // type is wrong; deeper checks would be noise
  }
  if (schema.enum && !schema.enum.includes(data)) {
    errs.push(`${p}: ${JSON.stringify(data)} not in enum [${schema.enum.join(', ')}]`);
  }
  const isObj = data !== null && typeof data === 'object' && !Array.isArray(data);
  if (isObj && (schema.properties || schema.required || schema.additionalProperties)) {
    for (const r of schema.required || []) {
      if (!(r in data)) errs.push(`${p}: missing required property '${r}'`);
    }
    if (schema.properties) {
      for (const [k, sub] of Object.entries(schema.properties)) {
        if (k in data) validate(data[k], sub, `${p}/${k}`, errs);
      }
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      const known = new Set(Object.keys(schema.properties || {}));
      for (const k of Object.keys(data)) {
        if (!known.has(k)) validate(data[k], schema.additionalProperties, `${p}/${k}`, errs);
      }
    }
  }
  if (Array.isArray(data) && schema.items) {
    data.forEach((item, i) => validate(item, schema.items, `${p}[${i}]`, errs));
  }
}

function isEmptyStub(data) {
  return data !== null && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0;
}

// Find every blueprint data.json under examples/*/blueprint/*/{design-thinking,system-design}/*/
function findDataFiles() {
  const out = [];
  const examplesDir = path.join(ROOT, 'examples');
  if (!fs.existsSync(examplesDir)) return out;
  for (const proj of fs.readdirSync(examplesDir)) {
    const bp = path.join(examplesDir, proj, 'blueprint');
    if (!fs.existsSync(bp)) continue;
    for (const ver of fs.readdirSync(bp)) {
      for (const category of ['design-thinking', 'system-design']) {
        const catDir = path.join(bp, ver, category);
        if (!fs.existsSync(catDir)) continue;
        for (const step of fs.readdirSync(catDir)) {
          const df = path.join(catDir, step, 'data.json');
          if (fs.existsSync(df)) out.push({ file: df, category, step });
        }
      }
    }
  }
  return out;
}

function main() {
  const files = findDataFiles();
  let validated = 0, skippedNoSchema = 0, skippedEmpty = 0, failed = 0;
  const allErrors = [];

  for (const { file, category, step } of files) {
    const rel = path.relative(ROOT, file);
    const schemaPath = SCHEMA_MAPS[category][step];
    if (!schemaPath) { skippedNoSchema++; continue; }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      allErrors.push(`${rel}: invalid JSON (${e.message})`);
      failed++;
      continue;
    }
    if (isEmptyStub(data)) { skippedEmpty++; continue; }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const errs = [];
    validate(data, schema, rel, errs);
    if (errs.length) {
      failed++;
      allErrors.push(...errs);
    } else {
      validated++;
      console.log(`  ✓ ${rel}`);
    }
  }

  console.log(
    `  (validated ${validated}, skipped ${skippedNoSchema} no-schema + ${skippedEmpty} empty-stub)`
  );
  if (allErrors.length) {
    console.error('\n  ✗ Blueprint schema violations:');
    for (const e of allErrors) console.error(`    - ${e}`);
    process.exit(1);
  }
  console.log('✓ All populated blueprint data.json conform to their skill schemas');
}

main();
