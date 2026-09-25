# Swagger Decorator Reference

The decorators are how you document each part of an endpoint: the controller, the request/response schemas, parameters, enums, nested types and validation. This reference is the complete decorator toolkit.

---

## Controller Decorators

```typescript
@Controller('payments')
@ApiTags('payments')
export class PaymentsController {
  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto, description: 'Invalid request' })
  @ApiResponse({ status: 401, type: UnauthorizedDto, description: 'Unauthorized' })
  async createPayment(@Body() body: CreatePaymentDto) { ... }
}
```

**Why `@ApiTags`**: Groups endpoints in the docs UI. **Why multiple `@ApiResponse`**: Documents every possible outcome.

---

## Request Body Documentation

```typescript
export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment amount', example: 99.99 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({ description: 'Customer email', example: 'user@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'card' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
```

**Why `@ApiProperty({ example })`**: Gives clients a concrete example. **Why `@ApiPropertyOptional`**: Marks the field as not required.

---

## Parameter Documentation

```typescript
@Get(':id')
@ApiParam({ name: 'id', description: 'Payment ID', type: 'string' })
@ApiQuery({ name: 'include', description: 'Related resources to include', enum: ['invoices', 'refunds'] })
async getPayment(
  @Param('id') id: string,
  @Query('include') include?: string[],
) { ... }
```

**Why `@ApiParam`/`@ApiQuery`**: Documents path and query parameters so clients know what to send.

---

## Grouping and Tagging

```typescript
// By Resource
@Controller('payments')
@ApiTags('payments')
export class PaymentsController { ... }

@Controller('refunds')
@ApiTags('refunds')
export class RefundsController { ... }

// By Version
@Controller('users')
@ApiTags('users-v2')
export class UsersV2Controller { ... }
```

---

## Documentation for Enums

```typescript
enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class PaymentDto {
  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  status: PaymentStatus;
}
```

**Why `@ApiProperty({ enum })`**: Exposes the allowed values in the schema.

---

## Documentation for Complex Types (Nested Objects)

```typescript
export class AddressDto {
  @ApiProperty() street: string;
  @ApiProperty() city: string;
  @ApiProperty() country: string;
  @ApiProperty() postalCode: string;
}

export class CustomerDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;

  @ApiProperty({ type: () => [AddressDto] })
  addresses: AddressDto[];

  @ApiProperty({ type: () => CustomerPreferencesDto })
  preferences: CustomerPreferencesDto;
}
```

**Why `type: () => [AddressDto]`**: Circular reference handling. Using an arrow function avoids TypeScript evaluation issues.

---

## Automatic Schema from class-validator

```typescript
// class-validator decorators automatically generate schema
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @MinLength(8)
  @ApiProperty({ description: 'Password (min 8 characters)' })
  password: string;
}
```

**Why pair `@ApiProperty` with validators**: The schema reflects the validation rules.

---

## Quality Checklist

```
[ ] @ApiTags on every controller
[ ] @ApiOperation summary + description on every endpoint
[ ] @ApiResponse documents success + all error cases
[ ] Every DTO field has @ApiProperty (with example)
[ ] Nested/circular types use type: () => [...]
[ ] Enums exposed via @ApiProperty({ enum })
[ ] class-validator paired with @ApiProperty
```
