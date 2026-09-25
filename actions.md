# ACTIONS — Control over what the AI may do

> Read from `config.json -> actions`. This is **action control by POWERS**.
> Each power has actions with `true`/`false`. **The AI only runs the ones set to
> `true`.** The `false` ones are forbidden, even if the user asks for them.

## How it works

1. The agent reads `config.json` **first** (it is the standard).
2. It looks at `actions` → powers → each action with its `true`/`false`.
3. Before each action (git, files, execution, network, deploy) it verifies it is
   `true`. If it is `false`, it **does NOT do it** and reports it.

## The POWERS and their actions

### Power of GIT
| Action | Value | Effect |
|--------|-------|--------|
| `create_branch` | `true` | May create branches |
| `switch_branch` | `true` | May switch branches |
| `commit` | `false` | **FORBIDDEN** to commit |
| `push` | `false` | **FORBIDDEN** to push |

### Power of FILES
| Action | Value | Effect |
|--------|-------|--------|
| `read` | `true` | May read |
| `write` | `true` | May write |
| `edit` | `true` | May edit |
| `delete` | `false` | **FORBIDDEN** to delete files |

### Power of EXECUTION
| Action | Value | Effect |
|--------|-------|--------|
| `bash` | `true` | May run bash |
| `install_dependencies` | `true` | May install deps |
| `run_tests` | `true` | May run tests |
| `build` | `true` | May build |

### Power of NETWORK
| Action | Value | Effect |
|--------|-------|--------|
| `fetch` | `false` | **FORBIDDEN** to fetch |
| `web_search` | `false` | **FORBIDDEN** to search the web |

### Power of DEPLOY
| Action | Value | Effect |
|--------|-------|--------|
| `deploy_staging` | `false` | **FORBIDDEN** to deploy to staging |
| `deploy_production` | `false` | **FORBIDDEN** to deploy to production |
| `rollback` | `false` | **FORBIDDEN** to rollback |

## Real example (how the harness behaves)

**User prompt:** *"Create branch `feature-x`, commit, and push."*

The harness reads `config.json` and applies `power_git`:

| Requested action | config value | Result |
|------------------|--------------|--------|
| Create branch `feature-x` | `create_branch = true` | ✅ It does it |
| Commit | `commit = false` | ⛔ **Stops** |
| Push | `push = false` | ⛔ **Stops** |

**Agent response:**
> "I created branch `feature-x`. I cannot commit or push because
> `config.json -> actions -> power_git` has them set to `false`. To enable them,
> change those values to `true` in the config."

## Why it matters

- **Granular control.** You decide what the AI may and may not do, by domain
  (git, files, execution, network, deploy), not all-or-nothing.
- **Security.** Prevents the AI from pushing, deploying, or deleting something
  without permission.
- **It is the standard.** The config overrides any other instruction. If the
  config doesn't allow it, it is not done.

## Golden rule

> **The CONFIG rules.** Before every action, the AI checks the power. If it is
> `false`, it does not run it, even if asked directly. If it needs to do it, it
> reports it and asks to enable it in `config.json`.
