# Event Flow Example

The flow shows how a user-created event propagates from the user service to the merchant service via Kafka, using consumer groups.

---

## User → Kafka → Merchant

```
[User Service]                    [Kafka]                    [Merchant Service]
      |                              |                              |
      |-- USER_CREATED event -------->|                              |
      |                              |                              |
      |                              |<--------- USER_CREATED -------|
      |                              |        (Merchant Group)       |
      |                              |                              |
      |                              |                     Creates initial
      |                              |                     merchant user
      |                              |                              |
      |-- USER_ACTIVATED event ----->|                              |
      |                              |                              |
      |                              |<--------- USER_ACTIVATED -----|
      |                              |        (Merchant Group)       |
      |                              |                              |
      |                              |                     Creates admin user
      |                              |                              |
```

---

## Quality Checklist

```
[ ] Flow documented (User -> Kafka -> Merchant)
[ ] Consumer groups shown
[ ] Commands dispatched on event consumption
```
