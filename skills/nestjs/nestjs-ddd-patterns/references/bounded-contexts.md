# Bounded Contexts

A bounded context is a boundary where a particular domain model applies. Inside, everyone speaks the same language.

---

## Microservices Architecture

```
Microservices Architecture:
├── account           -> Master accounts, sub-accounts, envelopes
├── authentication    -> User auth, OAuth
├── merchant          -> KYB onboarding, merchant management
├── payment_processor -> Payment processing
├── card_management   -> Physical/virtual cards
└── {domain}_core     -> External system integrations
```

---

## Quality Checklist

```
[ ] Each bounded context owns its schema/model
[ ] No cross-context dependencies
[ ] Ubiquitous language within each context
```
