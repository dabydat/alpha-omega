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
# Each memory file gets a note: follow the harness pattern + the harness source path.
copy_memory() {
  local src="$1" dst="$2"
  if [ -e "$dst" ]; then
    echo "  (skipped, already exists: ${dst#$TARGET/})"
    return
  fi
  mkdir -p "$(dirname "$dst")"
  local tmp; tmp="$(mktemp)"
  { sed -n '1p' "$src"; echo; echo "> Project traceability. To write here, follow the harness pattern (config.json → templates.files). Harness source: $HARNESS_DIR"; echo; sed -n '2,$p' "$src"; } > "$tmp"
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

## How it works
1. **Read `.alpha-omega/config.json` FIRST** — it is this project control panel.
2. **Go to the harness** at `__HARNESS_SRC__` (the pwd where `install.sh` was run) and
   execute the rules it declares (stacks, components, actions, budget, blocked_files,
   templates). The harness content is there: the loop (`GUIDE.md` §2), routing
   (`ROUTING.md` §11), agents, skills, rules, commands, neurons.
3. **Deliver in the project**, then leave the traceability in your adapter's
   `memory/` (e.g. `.opencode/memory/STATE.md`).

Throughout the harness, **`config.json` means `.alpha-omega/config.json`**.

## Golden rule
If the CONFIG does not allow it, it is not done. Never overwrite a template
(`config.json → templates.files`): SPECS → copy to a new file; MEMORY → create
your state in your adapter folder and read it THERE first.
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
