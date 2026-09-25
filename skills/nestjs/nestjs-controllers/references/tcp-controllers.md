# TCP Controller Implementation

TCP controllers handle message-based communication between internal microservices. See `references/tcp-controllers.md` for full patterns.

---

## TCP Controller Example

```typescript
@Controller()
export class MerchantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(MerchantControllerMap.CREATE_MERCHANT_ACCOUNT.MESSAGE_PATTERN)
  @UseFilters(RpcGlobalExceptionFilter)
  async createMerchantAccount(@Payload() request: CreateMerchantAccountRequest) {
    const command = MerchantMapper.toCreateCommand(request);
    return this.commandBus.execute(command);
  }

  @MessagePattern(MerchantControllerMap.GET_MERCHANT.MESSAGE_PATTERN)
  @UseFilters(RpcGlobalExceptionFilter)
  async getMerchant(@Payload() request: GetMerchantRequest) {
    const query = MerchantMapper.toGetQuery(request);
    return this.queryBus.execute(query);
  }
}
```

**Key insight**: TCP controllers use `@MessagePattern` decorator. The message pattern is a string that acts as an address for the message queue.

---

## Why TCP over HTTP

| Aspect | TCP | HTTP |
|--------|-----|------|
| Latency | Lower | Higher |
| Type safety | MessagePattern decorators | DTOs |
| Client support | NestJS microservices only | Any HTTP client |
| Retry logic | Built-in via broker | Manual |

**Why NOT use TCP for external facing**: Clients (mobile, web) cannot directly consume TCP. Use REST for external-facing gateways.

---

## Exception Filter for TCP

```typescript
@Catch()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToRpc();
    let response: RpcExceptionResponse;

    if (exception instanceof DomainException) {
      response = { message: exception.message, exceptionName: exception.exceptionName, status: 409, details: exception.details };
    } else if (exception instanceof HttpException) {
      response = { message: exception.getResponse() as string, status: exception.getStatus() };
    } else if (exception instanceof Error) {
      response = { message: exception.message, status: 500 };
    } else {
      response = { message: 'Internal server error', status: 500 };
    }
    ctx.setResponse(response);
  }
}
```

**Why 7 cases**: All exception types must be handled. Unknown exceptions become 500.

---

## Quality Checklist

```
[ ] @MessagePattern used for message routing
[ ] @UseFilters applies RpcGlobalExceptionFilter
[ ] Thin controller delegates to CommandBus/QueryBus
[ ] Mapper transforms request DTO to command/query
[ ] No business logic in controller
```