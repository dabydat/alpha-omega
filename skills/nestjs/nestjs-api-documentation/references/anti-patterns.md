# API Documentation Anti-Patterns

These are the common mistakes that make documentation useless. Each shows the INCORRECT pattern and the CORRECT fix.

---

## No documentation for errors

```typescript
// INCORRECT: Unknown error cases
@ApiResponse({ status: 500, description: 'Internal error' })

// CORRECT
@ApiResponse({ status: 409, type: ConflictErrorDto, description: 'Payment already processed' })
@ApiResponse({ status: 422, type: ValidationErrorDto, description: 'Invalid payment data' })
```

**Fix**: Document all error cases (e.g. 409, 422) with typed DTOs and descriptions.

---

## Generic operation descriptions

```typescript
// INCORRECT: No detail
@ApiOperation({ summary: 'Do something' })

// CORRECT
@ApiOperation({ summary: 'Create a new payment', description: 'Creates a payment intent and returns client secret for frontend confirmation' })
```

**Fix**: Clear, concise descriptions.

---

## Missing examples

```typescript
// INCORRECT: No examples
@ApiProperty()
email: string;

// CORRECT
@ApiProperty({ example: 'user@example.com' })
email: string;
```

**Fix**: Add examples to every `@ApiProperty`.

---

## Inconsistent documentation

```typescript
// INCORRECT: Some endpoints documented, others not
@Controller()
export class UserController {
  @Get()  // Documented
  async getUsers() { ... }

  @Post()  // Not documented
  async createUser() { ... }
}
```

**Fix**: Document all public endpoints.

---

## Quality Checklist

```
[ ] All error statuses documented (not just 500)
[ ] @ApiOperation descriptions are specific, not "Do something"
[ ] Every @ApiProperty has an example
[ ] Every public endpoint is documented consistently
```
