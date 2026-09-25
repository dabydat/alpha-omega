# Coding Rules

> Source: refactoring.guru — applied to all code.
> All developers MUST pass these rules before any PR is merged.

## Quick Reference Card

```
Function length:       max 30 lines
File length:           max 200 lines
Parameters:           max 3 (use object beyond)
Nesting:              max 3 levels

SOLID:
  S — Single Responsibility
  O — Open/Closed
  L — Liskov Substitution
  I — Interface Segregation
  D — Dependency Inversion
```

## SOLID Principles (mandatory)

| Principle | Rule | Violation Example | Fix |
|-----------|------|-------------------|-----|
| **S** — Single Responsibility | One class/function = one reason to change | UserService handles auth + email + DB | Split into AuthService, EmailService, UserRepository |
| **O** — Open/Closed | Open for extension, closed for modification | Adding `if ($type === 'stripe')` in core | Use Strategy pattern |
| **L** — Liskov Substitution | Subclasses must honor parent contracts | Child throws exceptions parent doesn't | Redesign hierarchy |
| **I** — Interface Segregation | Don't force classes to implement unused methods | IWorker with eat() forced on Robot | Split interfaces |
| **D** — Dependency Inversion | Depend on abstractions, not concretions | new StripeService() inside business logic | Inject interface |

## Code Smells — Identify and Fix

### Bloaters
- **Long Method** (>30 lines) → Extract Method
- **Large Class** (>200 lines) → Extract Class
- **Long Parameter List** (>3 params) → Introduce Parameter Object
- **Data Clumps** → Extract Class for the group

### OO Abusers
- **Switch Statements** → Replace with polymorphism (Strategy/State)
- **Temporary Field** → Extract Class
- **Refused Bequest** → Replace Inheritance with Delegation

### Change Preventers
- **Divergent Change** → Extract Class (each reason = one class)
- **Shotgun Surgery** → Move Method/Field to centralize

### Dispensables
- **Duplicate Code** → Extract Method
- **Dead Code** → Delete immediately
- **Speculative Generality** → Delete unused abstractions

### Couplers
- **Feature Envy** → Move Method to the class it envies
- **Inappropriate Intimacy** → Move Field/Method, use Facade
- **Message Chains** → Hide Delegate
- **Middle Man** → Inline Delegation if it adds no value

## Design Patterns — When to Apply

| Need | Pattern | Example |
|------|---------|---------|
| Object creation at runtime | Factory Method | Template per framework |
| Complex object construction | Builder | ConfigBuilder |
| Wrap incompatible interface | Adapter | GitAdapter wraps git CLI |
| Simplify complex subsystem | Facade | AI API wrapper |
| Add behavior dynamically | Decorator | Caching, logging layers |
| Swap algorithms at runtime | Strategy | Multiple AI agents |
| State-based behavior | State | Order: pending→paid→complete |
| Encapsulate actions | Command | Laravel Jobs |

## Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Breaking: add ! after type → feat!: remove legacy API
```

## Non-Negotiable Before Any PR

```
□ No magic values → named constants
□ No deeply nested code → guard clauses
□ No duplicate logic → extracted to shared method
□ No dead code → deleted
□ Functions ≤ 30 lines
□ Files ≤ 200 lines
□ Parameters ≤ 3 (or use Parameter Object)
□ All public methods have return type annotation
```