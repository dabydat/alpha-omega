#!/usr/bin/env bash
# alpha-omega install — deploys the harness into a project.
# Usage: ./install.sh /path/to/project
# Copies: core + agents/commands/rules/skills + the active stack(s) + the ai_org adapter.
set -eu

HARNESS_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:?Usage: ./install.sh /path/to/project}"
MANIFEST="$HARNESS_DIR/config.json"

mkdir -p "$TARGET"

# Read config.json (ai_org, switch.stacks, switch.components)
read_cfg() {
  if command -v node >/dev/null 2>&1; then
    node -e '
      const m = require(process.argv[1]);
      console.log(m.ai_org || "");
      console.log((m.switch && m.switch.stacks || []).join(","));
      console.log((m.switch && m.switch.components || []).join(","));
    ' "$MANIFEST"
  else
    python3 -c '
      import json,sys
      m = json.load(open(sys.argv[1]))
      s = m.get("switch", {})
      print(m.get("ai_org",""))
      print(",".join(s.get("stacks",[])))
      print(",".join(s.get("components",[])))
    ' "$MANIFEST"
  fi
}

AI_ORG="$(read_cfg | sed -n 1p)"
STACKS="$(read_cfg | sed -n 2p)"
COMPONENTS="$(read_cfg | sed -n 3p)"

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

echo "alpha-omega -> $TARGET  (ai_org=$AI_ORG  stacks=$STACKS)"

# Core (always)
for f in README.md AGENTS.md protocol.md GUIDE.md .claude/CLAUDE.md ROUTING.md actions.md; do
  [ -f "$HARNESS_DIR/$f" ] && copy "$HARNESS_DIR/$f" "$TARGET/$f"
done
copy "$HARNESS_DIR/scripts" "$TARGET/scripts"
copy "$HARNESS_DIR/memory" "$TARGET/memory"
copy "$HARNESS_DIR/config.json" "$TARGET/config.json"

# Content components
for c in agents commands rules skills; do
  if has "$COMPONENTS" "$c"; then
    copy "$HARNESS_DIR/$c" "$TARGET/$c"
  fi
done

# Active stack(s): knowledge lives at skills/<stack>/ per stack
IFS=',' read -ra STACKARR <<< "$STACKS"
for s in "${STACKARR[@]}"; do
  [ -n "$s" ] || continue
  if [ -d "$HARNESS_DIR/skills/$s" ]; then
    echo "  stack: $s"
    if ! has "$COMPONENTS" skills; then
      copy "$HARNESS_DIR/skills/$s" "$TARGET/skills/$s"
    fi
  else
    echo "  (stack '$s': no knowledge at skills/$s)"
  fi
done

# Adapter for the active ai_org (the only one that is read)
case "$AI_ORG" in
  opencode) copy "$HARNESS_DIR/.opencode" "$TARGET/.opencode" ;;
  claude)   copy "$HARNESS_DIR/.claude" "$TARGET/.claude" ;;
  cursor)   copy "$HARNESS_DIR/.cursor" "$TARGET/.cursor" ;;
  copilot)  copy "$HARNESS_DIR/.github" "$TARGET/.github" ;;
  gemini)   copy "$HARNESS_DIR/.gemini" "$TARGET/.gemini" ;;
  *)        echo "  (no adapter for ai_org=$AI_ORG)" ;;
esac

echo "Done. The agent reads config.json first and operates only on what is active."
