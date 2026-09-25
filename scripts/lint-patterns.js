#!/usr/bin/env node
/**
 * lint-patterns.js — Linter determinista de patrones NestJS.
 *
 * Reemplaza al golden set eliminado: en lugar de evals que nadie ejecutaba,
 * este script verifica el código REAL contra las reglas de calidad del harness
 * (rules/coding.md) usando grep/regex. Cuesta ~0 tokens (es Bash/Node puro)
 * y detecta violaciones de verdad.
 *
 * Reglas (umbrales de rules/coding.md):
 *   - file-too-long      archivo > 200 líneas
 *   - console-log        console.log/error/warn/debug/info en código TS
 *   - long-function      función/método > 30 líneas (heurística de llaves)
 *   - too-many-params    función/método con > 3 parámetros
 *   - controller-repo    @Controller con acceso directo a repositorio (no thin)
 *   - query-returns-entity  @QueryHandler devuelve Entity en vez de DTO
 *   - vo-not-frozen      ValueObject cuyo constructor no usa Object.freeze
 *
 * Uso:
 *   node scripts/lint-patterns.js                    # escanea ./src (o --dir)
 *   node scripts/lint-patterns.js --dir apps         # escanea apps/
 *   node scripts/lint-patterns.js --json             # salida JSON
 *   node scripts/lint-patterns.js --no vo-not-frozen # desactiva una regla
 *   node scripts/lint-patterns.js --quiet            # solo resumen
 *
 * Exit code: 1 si hay violaciones (útil como quality gate / CI).
 */

const fs = require('fs');
const path = require('path');

// Umbrales (rules/coding.md)
const MAX_FILE_LINES = 200;
const MAX_FUNCTION_LINES = 30;
const MAX_PARAMS = 3;

// Reglas activas por defecto
const ALL_RULES = [
  'file-too-long',
  'console-log',
  'long-function',
  'too-many-params',
  'controller-repo',
  'query-returns-entity',
  'vo-not-frozen',
];

const args = process.argv.slice(2);
const DIR = argValue('--dir') || '.';
const JSON_OUT = args.includes('--json');
const QUIET = args.includes('--quiet');
const DISABLED = new Set();
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--no' && args[i + 1]) { DISABLED.add(args[i + 1]); }
}
const rules = ALL_RULES.filter((r) => !DISABLED.has(r));

function argValue(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

// ---------- utilidades ----------
function isCommentOrBlank(l) {
  const t = l.trim();
  return t === '' || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('#');
}

// ---------- colección de archivos ----------
function collectTs(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.git', 'coverage'].includes(entry.name)) continue;
      out.push(...collectTs(p));
    } else if (/\.ts$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

// ---------- heurística: longitud de funciones ----------
// Devuelve [{ name, start, length }] para cada firma de función/método.
function functionLengths(lines) {
  const fns = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Firma: contiene '(' ')' y '{' (o '{' en la siguiente línea) y no es if/for/while/switch/catch
    if (/[({]/.test(line) && line.includes('(') && line.includes(')') &&
        !/^\s*(if|for|while|switch|catch|return|import|export (const|interface|type|class|enum))/ .test(line)) {
      // detectar apertura de bloque
      let openIndex = i;
      if (!line.includes('{')) {
        // buscar '{' en las siguientes líneas (máx 3)
        for (let j = i + 1; j <= Math.min(i + 3, lines.length - 1); j++) {
          if (lines[j].includes('{')) { openIndex = j; break; }
        }
      }
      if (openIndex === i && !line.includes('{')) continue;

      // contar líneas hasta cerrar el bloque (depth)
      let depth = 0;
      let length = 0;
      let started = false;
      for (let j = openIndex; j < lines.length; j++) {
        const l = lines[j];
        // contar llaves (aprox; no cuenta cadenas con llaves)
        const opens = (l.match(/\{/g) || []).length;
        const closes = (l.match(/\}/g) || []).length;
        if (!started) { depth = opens - closes; started = true; }
        else { depth += opens - closes; }
        if (!isCommentOrBlank(l)) length++;  // mide líneas de CÓDIGO (no comentarios ni vacías)
        if (started && depth <= 0) break;
      }
      const name = (line.match(/(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/) || [])[1] || 'anonymous';
      fns.push({ name, start: i + 1, length });
    }
  }
  return fns;
}

// ---------- verificaciones ----------
function checkFile(file, content, lines, violations) {
  const rulesRun = [];

  // file-too-long
  if (rules.includes('file-too-long') && lines.length > MAX_FILE_LINES) {
    violations.push({ file, line: 1, rule: 'file-too-long', note: `${lines.length} líneas (máx ${MAX_FILE_LINES})` });
  }

  // console-log
  if (rules.includes('console-log')) {
    lines.forEach((l, i) => {
      if (/console\.(log|error|warn|debug|info|trace)\s*\(/.test(l)) {
        violations.push({ file, line: i + 1, rule: 'console-log', note: 'Usa LoggerPort en lugar de console' });
      }
    });
  }

  // long-function + too-many-params
  if (rules.includes('long-function') || rules.includes('too-many-params')) {
    for (const fn of functionLengths(lines)) {
      if (rules.includes('long-function') && fn.length > MAX_FUNCTION_LINES) {
        violations.push({ file, line: fn.start, rule: 'long-function', note: `'${fn.name}' tiene ${fn.length} líneas (máx ${MAX_FUNCTION_LINES})` });
      }
      // params
      if (rules.includes('too-many-params')) {
        const sigLine = lines[fn.start - 1];
        const params = extractParams(sigLine);
        if (params && params.length > MAX_PARAMS) {
          violations.push({ file, line: fn.start, rule: 'too-many-params', note: `'${fn.name}' tiene ${params.length} params (máx ${MAX_PARAMS})` });
        }
      }
    }
  }

  // controller-repo (thin controller)
  if (rules.includes('controller-repo') && /@Controller\s*\(/.test(content)) {
    const hasRepoInject = /@Inject\s*\(\s*[A-Z_]*REPOSITORY/.test(content) ||
                          /this\.\w*[Rr]epository/.test(content) ||
                          /this\.repo\b/.test(content) ||
                          /this\.\w*Repository\b/.test(content);
    if (hasRepoInject) {
      const line = content.split('\n').findIndex((l) => /@Inject|this\.\w*[Rr]epo/.test(l)) + 1;
      violations.push({ file, line: line || 1, rule: 'controller-repo', note: 'Controller accede a repositorio (debe ser thin y delegar a CQRS)' });
    }
  }

  // query-returns-entity
  if (rules.includes('query-returns-entity') && /@QueryHandler\s*\(/.test(content)) {
    lines.forEach((l, i) => {
      // return type Promise<X> donde X es Entity y no es Dto/Response
      const m = l.match(/Promise<\s*([A-Za-z0-9_<>[\]]+)\s*>/);
      if (m && /Entity/.test(m[1]) && !/Dto|Response/.test(m[1])) {
        violations.push({ file, line: i + 1, rule: 'query-returns-entity', note: `Query devuelve ${m[1]} (debe devolver DTO)` });
      }
    });
  }

  // vo-not-frozen
  if (rules.includes('vo-not-frozen') && /extends\s+ValueObject/.test(content)) {
    const classStart = content.indexOf('extends ValueObject');
    const classLines = lines.slice();
    // buscar si el constructor usa Object.freeze
    const hasFreeze = /Object\.freeze\s*\(/.test(content);
    if (!hasFreeze) {
      const line = classLines.findIndex((l) => /extends\s+ValueObject/.test(l)) + 1;
      violations.push({ file, line: line || 1, rule: 'vo-not-frozen', note: 'ValueObject no usa Object.freeze en el constructor' });
    }
  }
}

function extractParams(sigLine) {
  const m = sigLine.match(/\(([^)]*)\)/);
  if (!m) return null;
  const inner = m[1].trim();
  if (inner === '') return [];
  return inner.split(',').map((p) => p.trim()).filter((p) => p && !/^\s*$/.test(p));
}

// ---------- main ----------
function main() {
  const files = collectTs(DIR);
  const violations = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    checkFile(f, content, lines, violations);
  }

  const byRule = {};
  for (const v of violations) byRule[v.rule] = (byRule[v.rule] || 0) + 1;

  if (JSON_OUT) {
    console.log(JSON.stringify({ files: files.length, violations, byRule }, null, 2));
  } else if (!QUIET) {
    console.log(`Lint de patrones — ${files.length} archivos .ts en ${DIR}`);
    console.log('----------------------------------------');
    if (violations.length === 0) {
      console.log('✓ Sin violaciones.');
    } else {
      for (const v of violations) {
        console.log(`${path.relative(process.cwd(), v.file)}:${v.line}  [${v.rule}] ${v.note}`);
      }
      console.log('\n--- Resumen ---');
      for (const [r, n] of Object.entries(byRule)) console.log(`  ${r}: ${n}`);
    }
    console.log(`\nReglas activas: ${rules.join(', ')}`);
  } else {
    console.log(violations.length);
  }

  process.exit(violations.length > 0 ? 1 : 0);
}

main();
