#!/usr/bin/env node
// NSP-REV metrics — validates the Metrics section of memory.md and computes aggregates.
// Usage: node scripts/metrics.js [path/to/memory.md]
const fs = require("fs");
const path = require("path");
const file = process.argv[2] || path.join(__dirname, "..", "memory.md");
const content = fs.readFileSync(file, "utf8");
const m = content.match(/## Metrics[\s\S]*?(?=\n## |\n$)/);
if (!m) { console.log("NO METRICS SECTION in " + file); process.exit(1); }
const sec = m[0];
const sessions = [...sec.matchAll(/^- session: (\S+) \| date: (\S+) \| goal: (.+)$/gm)];
const steps = [...sec.matchAll(/steps_ms: perceive=(\d+) route=(\d+) plan=(\d+) fire=(\d+) evaluate=(\d+)/g)];
const latency = [...sec.matchAll(/total_latency_ms: (\d+)/g)];
const tokens = [...sec.matchAll(/estimated_tokens: (\d+)/g)];
const score = [...sec.matchAll(/judge_score: ([\d.]+)/g)];
const eff = [...sec.matchAll(/efficiency: ([\d.]+)/g)];
const plugins = [...sec.matchAll(/^- plugins: (.+)$/gm)];

console.log("=== NSP-REV METRICS (validated) ===");
console.log("sessions registered:", sessions.length);
sessions.forEach(s => console.log("  " + s[1] + " | " + s[2] + " | " + s[3]));
if (steps.length) {
  const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  console.log("average steps (ms): perceive=" + avg(steps.map(p => +p[1])) +
    " route=" + avg(steps.map(p => +p[2])) +
    " plan=" + avg(steps.map(p => +p[3])) +
    " fire=" + avg(steps.map(p => +p[4])) +
    " evaluate=" + avg(steps.map(p => +p[5])));
}
if (latency.length) console.log("average latency (ms):", (latency.reduce((a, b) => a + +b[1], 0) / latency.length).toFixed(0));
if (tokens.length) console.log("total estimated tokens:", tokens.reduce((a, b) => a + +b[1], 0));
if (score.length) console.log("average judge score:", (score.reduce((a, b) => a + +b[1], 0) / score.length).toFixed(3));
if (eff.length) console.log("average efficiency (score/1k tokens):", (eff.reduce((a, b) => a + +b[1], 0) / eff.length).toFixed(3));
if (plugins.length) { console.log("plugins measured:"); plugins.forEach(p => console.log("  " + p[1])); }
const complete = sessions.length >= 1 && steps.length === sessions.length && tokens.length === sessions.length && score.length === sessions.length;
console.log(complete ? "STATUS: GREEN (all sessions have complete metrics)" : "STATUS: INCOMPLETE (missing fields)");
process.exit(complete ? 0 : 1);
