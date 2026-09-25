# Domain First

Domain-Driven Design models business reality accurately in code. The code should reflect the business language that domain experts use.

---

## Core Principle: Domain First

```
INCORRECT:  Data model first, domain follows
            Table -> Entity -> Service with if-else rules

CORRECT:    Domain model first, infrastructure follows
            Domain (ubiquitous language) -> Aggregate -> Repository -> Table
```

Code that doesn't reflect business language creates translation layers between developers and domain experts.

---

## Quality Checklist

```
[ ] Domain model designed before data model
[ ] Code uses ubiquitous language
[ ] Infrastructure follows the domain
```
