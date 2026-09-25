#!/usr/bin/env node
// alpha-omega features — validates the registry against features.schema.json
// and renders features-chart.svg (per-feature estimated vs actual time + score).
// Usage: node scripts/features.js [path/to/features.json] [--chart]
const fs = require("fs");
const path = require("path");
const file = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : path.join(__dirname, "..", "features.json");
const withChart = process.argv.includes("--chart");
const schemaFile = path.join(path.dirname(file), "features.schema.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
const errors = [];
const fReq = schema.properties.features.items.required;
const props = schema.properties.features.items.properties;
if (!data.project) errors.push("root missing project");
for (const f of data.features || []) {
  for (const k of fReq) if (f[k] === undefined) errors.push(f.id + " missing " + k);
  for (const k of ["status", "tier"]) if (f[k] !== undefined && props[k].enum && !props[k].enum.includes(f[k])) errors.push(f.id + " invalid " + k + ": " + f[k]);
  if (f.id && !/^FEAT-\d{3}$/.test(f.id)) errors.push("invalid id pattern: " + f.id);
  if (f.status === "planned" && !f.plan) errors.push(f.id + " is planned but missing plan reference");
  for (const k of ["time_estimated_ms", "time_actual_ms", "tokens_actual", "retries"]) if (f[k] !== undefined && typeof f[k] !== "number") errors.push(f.id + " " + k + " must be a number");
  if (f.score !== undefined && (f.score < 0 || f.score > 1)) errors.push(f.id + " score out of range");
}
console.log("=== ALPHA-OMEGA FEATURES (validated against features.schema.json) ===");
console.log("project:", data.project);
const feats = data.features || [];
console.log("features registered:", feats.length);
const counts = {};
for (const f of feats) counts[f.status] = (counts[f.status] || 0) + 1;
console.log("by status:", Object.entries(counts).map(([s, n]) => s + "=" + n).join(" ") || "(none)");
const totalActual = feats.reduce((a, f) => a + (f.time_actual_ms || 0), 0);
const avgScore = feats.filter(f => f.score !== undefined).length ? (feats.reduce((a, f) => a + (f.score || 0), 0) / feats.filter(f => f.score !== undefined).length).toFixed(2) : "-";
console.log("total actual time:", totalActual + "ms | average score:", avgScore);

if (withChart && feats.length) {
  const W = 860, H = 60 + feats.length * 46, PL = 190, MAX = Math.max(...feats.map(f => f.time_estimated_ms || 0), ...feats.map(f => f.time_actual_ms || 0), 1);
  const colors = { done: "#16a34a", in_progress: "#2563eb", blocked: "#dc2626", planned: "#f59e0b", proposed: "#94a3b8", rejected: "#64748b" };
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`;
  svg += `<rect width="${W}" height="${H}" fill="#fff"/>`;
  svg += `<text x="16" y="24" font-size="14" font-weight="bold">alpha-omega feature track — estimated vs actual time (ms)</text>`;
  feats.forEach((f, i) => {
    const y = 44 + i * 46;
    svg += `<text x="8" y="${y + 12}" font-size="11">${f.id} ${f.name}</text>`;
    svg += `<text x="${PL - 8}" y="${y + 12}" font-size="10" text-anchor="end" fill="#555">${f.status}</text>`;
    const xe = (f.time_estimated_ms || 0) / MAX * (W - PL - 120);
    const xa = (f.time_actual_ms || 0) / MAX * (W - PL - 120);
    svg += `<rect x="${PL}" y="${y}" width="${Math.max(xe, 2)}" height="9" fill="#cbd5e1"/>`;
    svg += `<text x="${PL + Math.max(xe, 2) + 5}" y="${y + 8}" font-size="9" fill="#475569">est ${f.time_estimated_ms || 0}</text>`;
    svg += `<rect x="${PL}" y="${y + 12}" width="${Math.max(xa, 2)}" height="9" fill="${colors[f.status] || "#94a3b8"}"/>`;
    svg += `<text x="${PL + Math.max(xa, 2) + 5}" y="${y + 20}" font-size="9" fill="#0f172a">actual ${f.time_actual_ms || 0}${f.time_actual_ms > (f.time_estimated_ms || 0) ? " (overran)" : ""} · score ${f.score !== undefined ? f.score : "-"}</text>`;
  });
  svg += `</svg>`;
  const out = path.join(path.dirname(file), "features-chart.svg");
  fs.writeFileSync(out, svg);
  console.log("chart written:", out);
}
if (errors.length) { console.log("ERRORS:"); errors.forEach(e => console.log("  " + e)); process.exit(1); }
console.log("STATUS: GREEN");
process.exit(0);
