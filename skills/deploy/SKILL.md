---
name: deploy
description: Complete deployment checklist to staging/production with rollback. Use when deploying to any environment with regression risk.
---

# neuron: deploy

- triggers_when: about to deploy to staging or production
- tier: T4
- budget: 1500 tokens
- eval: number of failed pre-deploy gates -> threshold 0
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Verify pre-deploy gates: lint, typecheck, tests, secrets, migrations.
2. Deploy to staging and validate the CI/CD pipeline.
3. Create a release tag and deploy to production.
4. Run the smoke test in <=5 min (health 200, key endpoints).
5. Monitor error tracking for 15 min; if error >10x baseline, rollback.

## Checklist
- [ ] lint + typecheck + tests pass
- [ ] No secrets in the diff
- [ ] Backward-compatible migrations applied
- [ ] Critical smoke test passes; rollback defined in advance

## Pitfalls
- Skipping a pre-deploy gate
- Deploying non-backward-compatible migrations
- Not defining the rollback criterion in advance
