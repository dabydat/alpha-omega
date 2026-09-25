# Self-Management Protocol

> AI follows this protocol AUTOMATICALLY.

## Rule 1: ALWAYS Plan Before Acting

```
RECEIVE TASK
    ↓
READ STATE.md (where am I?)
    ↓
CLASSIFY: trivial or non-trivial?
    ↓
TRIVIAL (< 1 file, < 20 lines):
    → Execute directly. Update STATE.md after.
    ↓
NON-TRIVIAL:
    → Enter PLAN MODE first.
    → Produce plan → Confirm with user OR proceed.
    → Execute.
    → Update STATE.md + CHANGELOG.md after.
```

## Rule 2: Context Sweep Before New Tasks

```
SWEEP CHECKLIST (silent):
□ Have I read STATE.md this session?
□ Do I know the active stack? (config.json → switch.stacks)
□ Does diagrams/code-graph.mermaid exist? Read it.
□ Is the task related to code I've already seen?
□ Am I about to read a file I've already read this session?
□ Is my context getting heavy? (see Rule 3)
```

## Rule 3: Auto-Compact Before Context Overflows

When to compact:
- After completing a major task
- Before starting an unrelated task in the same conversation
- When AI notices it's repeating information
- When context exceeds 60% of limit

How to compact:
Summarize what's been done and what's needed next, then continue.

## Rule 4: Never Lose Context Between Sessions

At END of every session (MANDATORY):
```
1. Update MEMORY/STATE.md:
   - Phase, last date, next action
   - What was completed
   - Files created/modified
2. Update MEMORY/CHANGELOG.md:
   - Date, what done, files changed, decisions
3. Update MEMORY/DECISIONS.md:
   - Any architectural decisions
```

If context running low and user hasn't said /end:
```
"Saving state before continuing. Next: /start to resume."
→ Execute save → Suggest new conversation
```

## Rule 5: Token-Efficient Reading

| Order | Method | Tokens |
|-------|--------|--------|
| 1 | Diagrams first | ~500 for full codebase map |
| 2 | Signatures only | Read function/class, not bodies |
| 3 | Targeted read | Specific function only (line ranges) |
| 4 | Full file | Only when implementing/debugging |

**Never:**
- Read entire file to answer question about one function
- Re-read a file already in context
- Read all files in a directory when graph shows which matter

## Rule 6: Self-Diagnosis

If AI notices these, act immediately:

| Signal | Action |
|--------|--------|
| Repeating explanation from earlier | Compact conversation |
| About to read large file | Check code-graph.mermaid first |
| Can't remember what was decided | Read DECISIONS.md |
| Doesn't know current state | Read STATE.md |
| Multiple approaches possible | Enter /brainstorm |
| Task touches 2+ modules | Run /blast-radius |
| About to write >50 lines | Plan it first |
| User seems frustrated by questions | Read STATE.md + CHANGELOG.md, stop asking |

## Rule 7: Start of Every Conversation

FIRST thing AI does:
1. Read `MEMORY/STATE.md` (mandatory, silent)
2. Check: continue previous work or new task?
3. If continuing: read last entry of CHANGELOG.md
4. If new work: ask what they want to do

AI does NOT announce that it's reading STATE.md. It just knows.

## Rule 8: When to Start New Conversation

- Context exceeds 60% of limit
- Changed phase or project
- 3+ days have passed
- AI starts repeating or confusing things

ALWAYS start with: "Read MEMORY/STATE.md"