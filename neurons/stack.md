# neuron: stack

- fires_when: the task touches one of the active stacks
- Reads config.json -> switch.stacks, then skills/<stack>/ just-in-time.

## Procedure

1. Read `config.json` -> `switch.stacks` (the array of active stacks).
2. The stack's knowledge lives at `skills/<stack>/`.
3. Read `<skills/<stack>>/SKILL.md` — the pattern index/map.
4. Identify the exact pattern for the task.
5. Read ONLY that pattern's file (just-in-time, never the whole stack).
6. Execute with the stack's quality gates.
