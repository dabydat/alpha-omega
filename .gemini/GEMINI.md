# GEMINI.md — alpha-omega (this gate)

> This is the **only** file in this gate. When Gemini starts, it reads this.

## Read config first

`config.json` is the control panel:
- `ai_org` — this tool. Only this gate is read.
- `blocked_files` — **NEVER** read those files.
- `actions` — only do what's allowed (`true`). `false` is forbidden.
- `switch.stacks` — the active stack → its knowledge at `skills/<stack>/`.

## Never overwrite a template

`config.json → templates.files` are read-only references. NEVER modify them.
- **SPECS** (`specs/TEMPLATE.md`): copy it to a NEW file with a new name.
- **MEMORY** (`memory/*.md`): they define the FORMAT only. Create your state in
  your adapter folder (e.g. `.opencode/memory/`) and read it THERE first — never
  in `memory/`.

## The path (just-in-time — read ONLY the section you need)

- Loop: `GUIDE.md` §2 (7 steps) — read ONLY §2.
- Routing: `ROUTING.md` §11 (synapse) — read ONLY §11.
- Law: `protocol.md` — only when extending.
- Agents: `agents/<role>.md` · Commands: `commands/` · Skills: `skills/` · Neurons: `neurons/`
- State: `.gemini/memory/STATE.md` · Gate: `scripts/lint-patterns.js`

Read ONLY the section that applies. Never read a whole file "just in case".

## Golden rule

If the CONFIG doesn't allow it, it is not done.
