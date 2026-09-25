# Why Document APIs

OpenAPI (formerly Swagger) provides machine-readable API documentation. Good documentation helps clients integrate faster and reduces support burden. This reference explains why documenting is non-negotiable and what "good" looks like.

---

## Without Documentation (INCORRECT)

```typescript
// No docs — contract is unknown to clients
@Post('/users')
async createUser(@Body() body: any): Promise<any> {
  return this.commandBus.execute(new CreateUserCommand(body));
}
```

**Problems**: No contract, no client code generation, no validation visibility, no interactive docs.

---

## With Documentation (CORRECT)

```typescript
// Documented endpoint — contract is explicit
@Post()
@ApiOperation({ summary: 'Create a new user' })
@ApiBody({ type: CreateUserRequestDto })
@ApiResponse({ status: 201, type: UserResponseDto })
async createUser(@Body() body: CreateUserRequestDto): Promise<UserResponseDto>
```

---

## Why it's good

- Contract clearly defined
- Client code generation possible
- Interactive docs (Swagger UI)
- Validation requirements visible

---

## Quality Checklist

```
[ ] Every public endpoint is documented
[ ] @ApiOperation has a meaningful summary + description
[ ] @ApiResponse documents success AND error cases
[ ] Request/response DTOs annotated with @ApiProperty
[ ] Bearer auth documented on protected endpoints
```
