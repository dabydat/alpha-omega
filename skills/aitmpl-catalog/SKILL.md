---
name: aitmpl-catalog
description: aitmpl.com template catalog for AI automation. Use when looking for a reusable component (skill, agent, command or MCP).
---

# neuron: aitmpl-catalog

- triggers_when: a reusable component from the catalog needs to be installed or located
- tier: T1
- budget: 200 tokens
- eval: correct component identified without inventing one -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Install `npm install -g AI-templates` if it does not exist.
2. List: `AI-templates list skills|agents|commands`.
3. Choose by category (Skills 139+, Agents 600+, Commands 200+, MCPs 55+).
4. Install: `AI-templates install <type> <name>`.
5. Verify installation at the project root and coexistence with the harness files.

## Checklist
- [ ] Real component from the catalog (not invented)
- [ ] Correct type (skill/agent/command/MCP)
- [ ] No conflict with local skills
- [ ] MIT license respected

## Pitfalls
- Inventing components that do not exist
- Installing in the wrong place (goes to `/` of the project)
- Confusing the component type
