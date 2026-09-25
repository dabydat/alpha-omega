---
name: create-spec
description: Creates a feature specification. Reads the decision tree and invokes the architect to validate patterns before writing the spec.
argument-hint: "[feature-name]"
---

# /create-spec — alpha-omega

Creates a feature spec, validating the design with the architect before writing.

## Steps
1. Read `memory/STATE.md`, `specs/TEMPLATE.md`, and the project diagrams (if they exist).
2. Invoke `architect`: recommend pattern, connection modules, file list, and risks.
3. Write `specs/[feature-name]-spec.md` with measurable acceptance criteria.
4. Create the feature flow diagram.

## EDD
Acceptance criteria must be verifiable (CA-1..N); the chosen pattern
must be justified by the architect, not by preference.

## Consolidation
Write to memory/STATE.md: spec created, pattern chosen, and status (draft/review/approved).
