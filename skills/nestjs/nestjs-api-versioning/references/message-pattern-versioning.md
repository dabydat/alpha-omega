# Internal Message Pattern Versioning

The BFF sends to the microservice with a versioned message pattern so v1 consumers don't receive v2 messages (and vice versa).

---

## BFF → Microservice with Version

```typescript
// BFF sends to microservice with version
@Post(UserRoutesV1.CREATE_USER)
async createUser(
  @Body() body: CreateUserRequestV1,
): Promise<UserResponseV1> {
  return firstValueFrom(
    this.client.send(
      UserMessagePatternsV1.CREATE_USER,  // v1 message pattern
      body,
    ),
  );
}

@Post(UserRoutesV2.CREATE_USER)
async createUserV2(
  @Body() body: CreateUserRequestV2,
): Promise<UserResponseV2> {
  return firstValueFrom(
    this.client.send(
      UserMessagePatternsV2.CREATE_USER,  // v2 message pattern
      body,
    ),
  );
}
```

**Why versioned message patterns**: Prevents a v1 request from being handled by a v2 handler (and vice versa).

---

## Quality Checklist

```
[ ] Message patterns versioned (v1.x.* vs v2.x.*)
[ ] Each version sends its own pattern
[ ] Cross-version message leakage prevented
```
