# Feature Spec Template

> ⚠️ **TEMPLATE — DO NOT MODIFY.** Copy this to a NEW file with a new name
> (e.g. `/create-spec user-authentication` → `specs/user-authentication-spec.md`).
> Never overwrite this template.

> Use this template when creating new feature specifications with `/create-spec [feature-name]`

## Template Structure

```markdown
# [Feature Name] — Spec

**Status:** Draft | Review | Approved
**Created:** YYYY-MM-DD
**Pattern:** [Selected design pattern]
**Files:** [Created/modified file list]

---

## 1. Overview

### Problem Statement
[What user/business problem does this solve? 1-2 sentences]

### Solution Summary
[How does this feature solve the problem? 1-2 sentences]

---

## 2. Design

### Design Pattern(s)
[Which pattern(s) apply?]
- Strategy / Factory / Repository / Observer / etc.

### Architecture
[High-level: components, data flow]

### Files to Create/Modify
```
src/
  path/to/file.ts   — [what this does]
  path/to/file.tsx  — [what this does]
```

---

## 3. Functionality

### Core Features

#### Feature 1: [Name]
**Description:** [What it does]
**Entry:** [What triggers it]
**Exit:** [What completes it]
**Edge Cases:**
- [Case 1] → [Handling]
- [Case 2] → [Handling]

### User Interactions
[Step-by-step user flow]

### Data Handling
[What data is read/written, transformations]

### Error Handling
[What can go wrong, how errors surface]

---

## 4. Dependencies

### Internal
- [Module/File] — [Why needed]

### External
- [Service/API] — [Purpose]

---

## 5. Acceptance Criteria

- [ ] [Criterion 1 — specific and testable]
- [ ] [Criterion 2 — specific and testable]
- [ ] [Criterion 3 — specific and testable]

### Success Metrics
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

---

## 6. Implementation Notes

### Token Budget
| Effort | Max Files | Strategy |
|--------|-----------|----------|
| S | 3 | Direct implementation |
| M | 6 | Read patterns first |
| L | 10+ | Plan → Implement → Test |

### Testing Approach
[What tests to write, where]

### Migration Needs
[Any DB migrations, config changes]
```

---

## Usage

```
/create-spec user-authentication
```

Creates `specs/user-authentication-spec.md` based on this template.

---

## Quick Reference

- **Pattern selection:** Read `skills/design-patterns/SKILL.md` + decision tree
- **Graph check:** Read `diagrams/code-graph.mermaid` to see where new code connects
- **Blast radius:** Run `/blast-radius [file]` before modifying existing files