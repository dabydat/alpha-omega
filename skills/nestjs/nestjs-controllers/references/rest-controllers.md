# REST Controller Patterns

REST controllers (BFF Gateway) handle external client requests and delegate to internal microservices. See `references/rest-controllers.md` for full patterns.

---

## BFF Gateway Pattern

**Why BFF (Backend-For-Frontend)**:
- External clients cannot use TCP (they speak HTTP)
- Gateway translates HTTP requests to TCP messages to internal services
- Gateway handles cross-cutting concerns (auth, rate limiting, response transformation)

**Why inject ClientProxy instead of direct HTTP calls**:
- You already have microservices infrastructure (RabbitMQ, Kafka)
- Message-based communication is more resilient (retry, dead-letter queues)
- Consistent transport: gateway speaks TCP to internal services

---

## REST Controller Implementation

```typescript
@Controller(EntityControllerTag)
@ApiTags(EntityControllerTag)
export class ApiGatewayEntityController {
  constructor(
    @Inject(ClientConstant.ENTITY_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post(EntityControllerMap.CREATE_ENTITY.ROUTE)
  @ApiOperation({ description: 'Create a new entity' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createEntity(
    @Body() body: CreateEntityRequest,
    @UserDetails() user: any,
  ): Promise<CreateEntityResponse> {
    const payload = { ...body, userId: user.userId };
    return firstValueFrom(
      this.client.send(EntityControllerMap.CREATE_ENTITY.MESSAGE_PATTERN, payload),
    );
  }
}
```

**Why `@UserDetails()` decorator**: Removes boilerplate, centralizes user extraction logic.

**Why `firstValueFrom(client.send(...))`**: Converts Observable to Promise for handler return type.

---

## ClientProxy Symbol Pattern

```typescript
export class ClientConstant {
  public static readonly ENTITY_SERVICE = Symbol('ENTITY_SERVICE');
  public static readonly ACCOUNT_SERVICE = Symbol('ACCOUNT_SERVICE');
}

export class EntityControllerMap {
  public static readonly CREATE_ENTITY = {
    MESSAGE_PATTERN: 'entity.create',
    ROUTE: '/entity',
  };
}
```

**Why Symbol instead of string**: Type-safe, prevents typos at compile time.

---

## Quality Checklist

```
[ ] Thin controller delegates to ClientProxy
[ ] firstValueFrom converts Observable to Promise
[ ] UserDetails() decorator injects user context
[ ] Swagger decorators for API documentation
[ ] Message pattern uses ControllerMap constant
```