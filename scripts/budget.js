#!/usr/bin/env node
/**
 * budget.js — valida el reparto de presupuesto de un plan multi-sub-acto.
 *
 * Lee config.json (session_tokens) y un plan en plan.jsonl (una línea por
 * sub-acto: {"id":"...","budget":<tokens>}). Suma los budgets y verifica:
 *   Σ(budget_i) <= session_tokens
 *
 * Uso:
 *   node scripts/budget.js                     # lee plan.jsonl
 *   node scripts/budget.js --budgets 512,2048  # budgets inline (sin plan.jsonl)
 *   node scripts/budget.js --session 24000     # override session_tokens
 *
 * Principio: ningún sub-acto excede su propio budget y la suma de todos no
 * supera el presupuesto de sesión. Esto es lo que hace operativa la
 * descomposición multi-intención.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'config.json');
const PLAN_FILE = path.join(__dirname, '..', 'plan.jsonl');

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return { budget: { session_tokens: 24000 } };
  const c = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  return c;
}

function loadPlan() {
  if (!fs.existsSync(PLAN_FILE)) return [];
  return fs.readFileSync(PLAN_FILE, 'utf8')
    .split('\n').map((l) => l.trim()).filter(Boolean)
    .map((l) => JSON.parse(l));
}

function main() {
  const config = loadConfig();
  let sessionBudget = config.budget && config.budget.session_tokens;
  const args = process.argv.slice(2);

  if (args.includes('--session')) {
    sessionBudget = parseInt(args[args.indexOf('--session') + 1], 10);
  }

  let plan;
  if (args.includes('--budgets')) {
    const idx = args.indexOf('--budgets');
    plan = args[idx + 1].split(',').map((b, i) => ({ id: 'sub-' + (i + 1), budget: parseInt(b, 10) }));
  } else {
    plan = loadPlan();
  }

  if (plan.length === 0) {
    console.log('budget: no sub-acts in plan.jsonl (or use --budgets). Nothing to validate.');
    return;
  }

  const total = plan.reduce((s, p) => s + (p.budget || 0), 0);
  const worst = Math.max(...plan.map((p) => p.budget || 0));

  console.log('Session budget:', sessionBudget);
  console.log('Sub-acts:', plan.length);
  console.log('Budget per sub-act:', plan.map((p) => `${p.id}=${p.budget}`).join(' '));
  console.log('Σ budgets:', total);
  console.log('Largest sub-act:', worst);

  const over = total > sessionBudget;
  console.log(over ? '✗ EXCEEDS session_tokens' : '✓ OK: Σ(budget_i) <= session_tokens');
  if (over) {
    const overflow = total - sessionBudget;
    console.log(`  Failed: need to reduce ${overflow} tokens (sequence instead of parallel, or compress the plan).`);
    process.exitCode = 1;
  }
}

main();
