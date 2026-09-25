#!/usr/bin/env node
/**
 * routes.js — la "feromona honesta".
 *
 * Lee routes.jsonl (una línea JSON por ejecución) y agrega POR RUTA:
 *   - success_rate  = wins / total
 *   - mean_score    = media de scores
 *   - mean_tokens   = media de tokens
 *   - efficiency    = mean_score / mean_tokens * 1000  (utilidad por 1k tokens)
 *   - total_latency_ms
 *
 * Uso:
 *   node scripts/routes.js            # imprime el agregado por ruta (tabla)
 *   node scripts/routes.js --json     # salida JSON (para el ruteo determinista)
 *   node scripts/routes.js --top 5    # top 5 rutas por success_rate*efficiency
 *
 * Principio: la feromona la agrega esta máquina. El agente solo registra.
 */

const fs = require('fs');
const path = require('path');

const ROUTES_FILE = process.env.ROUTES_FILE || path.join(__dirname, '..', 'routes.jsonl');
const THRESHOLD = 0.7; // score mínimo para contar como "win"

function load() {
  if (!fs.existsSync(ROUTES_FILE)) return [];
  return fs.readFileSync(ROUTES_FILE, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function aggregate(rows) {
  const byRoute = {};
  for (const r of rows) {
    const key = r.route || r.ruta || 'sin-ruta';
    if (!byRoute[key]) {
      byRoute[key] = {
        route: key,
        total: 0,
        wins: 0,
        scoreSum: 0,
        tokensSum: 0,
        latencySum: 0,
      };
    }
    const a = byRoute[key];
    a.total += 1;
    const score = typeof r.score === 'number' ? r.score : (r.score >= THRESHOLD ? 1 : 0);
    if (score >= THRESHOLD) a.wins += 1;
    a.scoreSum += score;
    a.tokensSum += r.tokens || r.estimated_tokens || 0;
    a.latencySum += r.latency_ms || 0;
  }

  return Object.values(byRoute).map((a) => {
    const meanScore = a.total ? a.scoreSum / a.total : 0;
    const meanTokens = a.total ? a.tokensSum / a.total : 0;
    return {
      route: a.route,
      total: a.total,
      wins: a.wins,
      success_rate: a.total ? a.wins / a.total : 0,
      mean_score: round(meanScore, 3),
      mean_tokens: Math.round(meanTokens),
      efficiency: round(meanTokens ? (meanScore / meanTokens) * 1000 : 0, 3),
      total_latency_ms: a.latencySum,
    };
  });
}

function round(n, d) { const p = Math.pow(10, d); return Math.round(n * p) / p; }

function main() {
  const rows = load();
  const agg = aggregate(rows);
  const arg = process.argv[2];

  if (arg === '--json') {
    console.log(JSON.stringify(agg, null, 2));
    return;
  }

  if (arg === '--top') {
    const n = parseInt(process.argv[3], 10) || 5;
    const sorted = [...agg].sort((x, y) =>
      (y.success_rate * y.efficiency) - (x.success_rate * x.efficiency)
    ).slice(0, n);
    console.log('Top routes by success_rate × efficiency:');
    for (const r of sorted) console.log(`  ${r.route}: ${r.success_rate} score ${r.efficiency} eff (${r.total} runs)`);
    return;
  }

  // Tabla por defecto
  console.log('routes.jsonl aggregate');
  console.log('----------------------------');
  if (agg.length === 0) {
    console.log('(empty)');
  }
  for (const r of agg) {
    console.log(
      `${pad(r.route, 28)} | runs ${pad(String(r.total), 4)} | wins ${pad(String(r.wins), 4)} | rate ${pad(String(r.success_rate), 5)} | eff ${pad(String(r.efficiency), 6)} | tok ${r.mean_tokens}`
    );
  }
  console.log(`\nRecords: ${rows.length} | Routes: ${agg.length}`);
}

function pad(s, n) { return String(s).padEnd(n); }

main();
