# Custom Response Decorators

For responses that repeat across endpoints (pagination, validation errors), build reusable custom decorators and DTOs instead of repeating `@ApiResponse` blocks.

---

## Paginated Response Decorator

```typescript
export const ApiOkResponsePaginated = <T>(type: Type<T>) => {
  return applyDecorators(
    ApiOkResponse({
      status: 200,
      description: 'Successful response',
      schema: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(type) } },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    }),
  );
};

@Get()
@ApiOkResponsePaginated(UserDto)
async getUsers(@Query() query: PaginationQuery) { ... }
```

**Why a custom decorator**: Reusable, keeps the paginated `{ data, meta }` shape consistent across all list endpoints.

---

## Error Response Documentation

```typescript
export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: ['email must be an email', 'amount must be a positive number'] })
  message: string[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/payments' })
  path: string;
}
```

**Why a typed error DTO**: Clients can rely on a stable error shape instead of parsing free-form messages.

---

## Quality Checklist

```
[ ] Paginated responses use a shared decorator ({ data, meta })
[ ] Error responses use a typed DTO
[ ] @ApiResponse status codes match the actual response
[ ] List endpoints always paginated and documented
```
