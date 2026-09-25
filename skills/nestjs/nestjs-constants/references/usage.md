# Usage in Controllers

The controller map is consumed by both the TCP microservice (via `MESSAGE_PATTERN`) and the REST BFF gateway (via `ROUTE`).

---

## Usage in TCP Controller

```typescript
@Controller()
export class AuthenticationController {
  @MessagePattern(AuthenticationControllerMap.FORGOT_PASSWORD_RESET.MESSAGE_PATTERN)
  async forgotPasswordReset(payload: ForgotPasswordResetRequest) {
    // Handler logic
  }
}
```

---

## Usage in REST Controller (BFF)

```typescript
@Controller(AuthenticationControllerName)
@ApiTags(AuthenticationControllerTag)
export class ApiGatewayAuthenticationController {
  @Post(AuthenticationControllerMap.FORGOT_PASSWORD_RESET.ROUTE)
  async forgotPasswordReset(@Body() body: ForgotPasswordResetDto) {
    // Sends to TCP microservice
    return firstValueFrom(
      this.client.send(
        AuthenticationControllerMap.FORGOT_PASSWORD_RESET.MESSAGE_PATTERN,
        body,
      ),
    );
  }
}
```

---

## Quality Checklist

```
[ ] TCP uses MESSAGE_PATTERN from map
[ ] REST uses ROUTE from map
[ ] BFF sends to the mapped MESSAGE_PATTERN
```
