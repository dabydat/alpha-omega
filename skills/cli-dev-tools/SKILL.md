---
name: cli-dev-tools
description: CLI development patterns and structure conventions. Use when building commands or command-line tools.
---

# neuron: cli-dev-tools

- triggers_when: a slash command or a CLI tool is created
- tier: T1
- budget: 300 tokens
- eval: command with complete frontmatter and correct structure -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Create `src/commands/<name>/` with index.ts and handler.ts.
2. Write the frontmatter: name, description, argument-hint, model.
3. Implement the tool in `src/tools/<Name>/` with toolName.ts and UI.tsx.
4. Add --help with examples, --verbose and --dry-run.
5. Review the quality checklist before delivering.

## Checklist
- [ ] Complete frontmatter (name, description, argument-hint)
- [ ] Types defined in all calls
- [ ] Complete error handling
- [ ] No hardcoded values; functions <=30 lines

## Pitfalls
- Forgetting argument-hint in the frontmatter
- Hardcoding values instead of constants
- Incorrect colors (green=ok, red=error)
