#!/usr/bin/env bash
# alpha-omega install — references the harness in a project (it does NOT copy it).
#
# Usage: ./install.sh /path/to/project
#
# It creates, in the project root:
#   .alpha-omega/config.json   this project's harness config (the one the AI reads)
#   <ai_org>/memory/           the project's traceability (e.g. .opencode/memory/)
#   AGENTS.md                  thin gate: read .alpha-omega/config.json; "go to the
#                              harness" at $HARNESS_DIR (where this install.sh runs).
#                              If it already exists, alpha-omega is prepended.
set -eu

HARNESS_DIR="$(cd "$(dirname "$0")" && pwd)"   # the SOURCE harness (where install.sh runs)
TARGET="${1:?Usage: ./install.sh /path/to/project}"

has() { case ",$1," in *",$2,"*) return 0;; *) return 1;; esac; }
copy() {
  src="$1" dst="$2"
  if [ -e "$dst" ]; then
    echo "  (skipped, already exists: ${dst#$TARGET/})"
  else
    mkdir -p "$(dirname "$dst")"
    cp -r "$src" "$dst"
    echo "  + ${dst#$TARGET/}"
  fi
}

# Read ai_org / switch.stacks / switch.components from a config file
read_cfg() {
  local m="$1"
  if command -v node >/dev/null 2>&1; then
    node -e '
      const m = require(process.argv[1]);
      console.log(m.ai_org || "");
      console.log((m.switch && m.switch.stacks || []).join(","));
      console.log((m.switch && m.switch.components || []).join(","));
    ' "$m"
  else
    python3 -c '
      import json,sys
      m = json.load(open(sys.argv[1]))
      s = m.get("switch", {})
      print(m.get("ai_org",""))
      print(",".join(s.get("stacks",[])))
      print(",".join(s.get("components",[])))
    ' "$m"
  fi
}

# 1. Create .alpha-omega/ with the project's config (default copied if missing)
mkdir -p "$TARGET/.alpha-omega"
[ -f "$HARNESS_DIR/config.json" ] && copy "$HARNESS_DIR/config.json" "$TARGET/.alpha-omega/config.json"

# 2. Read the PROJECT config (ai_org, stacks, components) from .alpha-omega/config.json
MANIFEST="$TARGET/.alpha-omega/config.json"
AI_ORG="$(read_cfg "$MANIFEST" | sed -n 1p)"
STACKS="$(read_cfg "$MANIFEST" | sed -n 2p)"
COMPONENTS="$(read_cfg "$MANIFEST" | sed -n 3p)"

echo "alpha-omega -> $TARGET  (ai_org=$AI_ORG  stacks=$STACKS  harness=$HARNESS_DIR)"

# 3. Adapter directory per ai_org + memory/ (the project's traceability)
# Each project memory file gets ONLY: the title line + where to take the format from.
copy_memory() {
  local src="$1" dst="$2"
  if [ -e "$dst" ]; then
    echo "  (skipped, already exists: ${dst#$TARGET/})"
    return
  fi
  mkdir -p "$(dirname "$dst")"
  local tmp; tmp="$(mktemp)"
  # Title + traceability pointer ONLY. The template body (the "DO NOT MODIFY"
  # banner, dummy sections, harness next-steps) deliberately stays behind: this
  # file is the project's LIVE state, and stamping a template warning on it made
  # agents treat their own state as read-only. Format lives in $HARNESS_DIR/memory/.
  { sed -n '1p' "$src"; echo; echo "> Project traceability. To write here, follow the harness pattern (config.json → templates.files). Harness source: $HARNESS_DIR"; } > "$tmp"
  mv "$tmp" "$dst"
  echo "  + ${dst#$TARGET/}"
}
case "$AI_ORG" in
  opencode) ADAPTER=".opencode" ;;
  claude)   ADAPTER=".claude" ;;
  cursor)   ADAPTER=".cursor" ;;
  copilot)  ADAPTER=".github" ;;
  gemini)   ADAPTER=".gemini" ;;
  *)        ADAPTER="" ;;
esac
if [ -n "$ADAPTER" ]; then
  mkdir -p "$TARGET/$ADAPTER/memory"
  for f in STATE.md CHANGELOG.md DECISIONS.md NOTIFICATIONS.md; do
    [ -f "$HARNESS_DIR/memory/$f" ] && copy_memory "$HARNESS_DIR/memory/$f" "$TARGET/$ADAPTER/memory/$f"
  done
  echo "  + $ADAPTER/memory/ (project traceability)"
fi

# 4. Thin gate at the project root -> read .alpha-omega/config.json; harness = $HARNESS_DIR
write_gate() {
  local dest="$1"
  local tmp; tmp="$(mktemp)"
  cat > "$tmp" <<'GATE'
# alpha-omega

This project uses the **alpha-omega** harness.

## The path — in order, every prompt. No step is optional.

The harness lives at `__HARNESS_SRC__` (the pwd where `install.sh` was run).
Paths below are relative to it, except the config, which is this project's.

1. `.alpha-omega/config.json` — blocked_files, actions, scripts, mcp, switch.
   What is `false` does not happen. A declared MCP that is not connected stops the task.
2. `rules/00-llm-algorithm.md` — priority #1. Zero emojis. Never invent a number.
3. `GUIDE.md` §1 — meta-prompt, language_policy, metrics, feature registry.
4. `<ai_org>/memory/STATE.md` in THIS project — your live state. Read it before planning.
5. `ROUTING.md` §11 — split the prompt into sub-acts, route each one, check the budget.
6. `agents/<role>.md` — the role that fires, including its "Never omit" section.
7. **PLAN + gate `[A] / [C] / [X]`** — present it and WAIT. No approval, no execution.
8. Execute in the project. Read before writing. Verify against the environment.
9. Consolidate: `STATE.md`, `routes.jsonl`, `features.json`.

Steps 1-6 are reading and cost almost nothing. Step 7 is where you stop.

If something did not get done, you either skipped it or nobody told you. This list
removes the second excuse: everything you owe is on it, in order. Skipping is now
the only remaining failure mode, and it is yours.

Beyond this list, read only the section that applies: `GUIDE.md` §2 for the loop,
`protocol.md` only when extending. Never a whole file "just in case".

Throughout the harness, **`config.json` means `.alpha-omega/config.json`**.

## Golden rule
If the CONFIG does not allow it, it is not done. Never overwrite a template
(`config.json → templates.files`): SPECS → copy to a new file.

**MEMORY — two locations, one immutable:**
- `__HARNESS_SRC__/memory/*.md` → the TEMPLATE (format only, never written).
- `<this project>/<ai_org>/memory/*.md` → **your live state.** Read it there first,
  write it there on consolidation. It never moves.

## Powers
`actions.power_execution` is grouped by EFFECT, not by tool: `read_only_search`
(grep/glob/find — allowed) is separate from `mutating_fs`, `network_egress`,
`db_write` and `vcs_write`. `read_only_search` NEVER overrides `blocked_files`.
`scripts.*` is the sole gate for `node scripts/<name>.js` — deterministic harness
tooling, never subject to `power_execution`.
GATE
  sed "s|__HARNESS_SRC__|$HARNESS_DIR|g" "$tmp" > "$tmp.2" && mv "$tmp.2" "$tmp"
  if [ -f "$dest" ]; then
    # exists -> PREPEND (alpha-omega first, to cut off any other flow/harness)
    local keep; keep="$(mktemp)"
    cat "$dest" > "$keep"
    cat "$keep" >> "$tmp"
    rm -f "$keep"
    mv "$tmp" "$dest"
    echo "  + (prepended) ${dest#$TARGET/}"
  else
    mv "$tmp" "$dest"
    echo "  + ${dest#$TARGET/}"
  fi
}

write_gate "$TARGET/AGENTS.md"

# The tool's gate (the file the CLI actually reads)
case "$AI_ORG" in
  opencode) echo "  (opencode reads AGENTS.md)" ;;
  claude)   write_gate "$TARGET/.claude/CLAUDE.md" ;;
  cursor)
    mkdir -p "$TARGET/.cursor/rules"
    dest="$TARGET/.cursor/rules/nsp-rev.mdc"
    if [ -f "$dest" ]; then
      { sed -n '1,/^---$/p' "$dest"; printf '%s\n' '' '# alpha-omega' '' 'Read `.alpha-omega/config.json` first. Every prompt goes through the harness.' ''; sed -n '/^---$/,$p' "$dest" | tail -n +2; } > "$dest.tmp" && mv "$dest.tmp" "$dest"
      echo "  + (inserted) .cursor/rules/nsp-rev.mdc"
    else
      { printf '%s\n' '---' 'description: alpha-omega — this project uses the harness.' 'globs: **/*' 'alwaysApply: true' '---' '' '# alpha-omega' '' 'Read `.alpha-omega/config.json` first. Every prompt goes through the harness.' ''; } > "$dest"
      echo "  + .cursor/rules/nsp-rev.mdc"
    fi
    ;;
  copilot)  write_gate "$TARGET/.github/copilot-instructions.md" ;;
  gemini)   write_gate "$TARGET/.gemini/GEMINI.md" ;;
esac

# 5. Add the created artifacts to the project's .gitignore (so they're not committed)
GITIGNORE="$TARGET/.gitignore"
if [ -f "$GITIGNORE" ] && grep -q "alpha-omega — auto-generated" "$GITIGNORE"; then
  echo "  (gitignore already has the alpha-omega entries)"
else
  {
    echo ""
    echo "# alpha-omega — auto-generated by install.sh (do not commit)"
    echo ".alpha-omega/"
    echo ".opencode/"
    echo ".claude/"
    echo ".cursor/rules/nsp-rev.mdc"
    echo ".github/copilot-instructions.md"
    echo ".gemini/GEMINI.md"
    echo "AGENTS.md"
  } >> "$GITIGNORE"
  echo "  + .gitignore (alpha-omega entries appended)"
fi

echo "Done. Config: $TARGET/.alpha-omega/config.json · harness: $HARNESS_DIR · traceability: $TARGET/$ADAPTER/memory/."
