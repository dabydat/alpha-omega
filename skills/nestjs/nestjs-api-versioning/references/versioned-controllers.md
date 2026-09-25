# Versioned Controllers

Each version gets its own controller and DTOs. The BFF gateway translates HTTP into the versioned message pattern.

---

## Versioned Controller Structure (BFF Gateway)

```
apps/web_backend/src/merchant/
├── infrastructure/
│   └── rest/
│       ├── v1/
│       │   ├── merchant.controller.ts
│       │   └── dto/
│       │       ├── create-merchant-request-v1.dto.ts
│       │       └── merchant-response-v1.dto.ts
│       └── v2/
│           ├── merchant.controller.ts
│           └── dto/
│               ├── create-merchant-request-v2.dto.ts
│               └── merchant-response-v2.dto.ts
└── merchant.module.ts
```

---

## V1 Controller

```typescript
// apps/web_backend/src/merchant/infrastructure/rest/v1/merchant.controller.ts
@Controller()
@ApiTags('Merchant')
export class MerchantV1Controller {
  @Get(MerchantRoutesV1.GET_MERCHANTS)
  @ApiOperation({ summary: 'Get all merchants (v1)' })
  async getMerchants(@Query() query: GetMerchantsQueryV1): Promise<MerchantResponseV1[]> {
    const merchants = await this.queryBus.execute(
      new GetMerchantsQuery(query.page, query.limit),
    );
    return merchants.map(this.mapToV1Response);
  }

  private mapToV1Response(merchant: Merchant): MerchantResponseV1 {
    return {
      id: merchant.id,
      businessName: merchant.businessName,
      email: merchant.contactEmail,
    };
  }
}
```

---

## V2 Controller

```typescript
// apps/web_backend/src/merchant/infrastructure/rest/v2/merchant-v2.controller.ts
@Controller(UserControllerName)
@ApiTags('Users')
export class UsersV2Controller {
  @Get(UserRoutesV2.GET_USERS)
  @ApiOperation({ summary: 'Get all users (v2)' })
  async getUsers(@Query() query: GetUsersQueryV2): Promise<UserResponseV2[]> {
    const users = await this.queryBus.execute(
      new GetUsersQuery(query.page, query.limit),
    );
    return users.map(this.mapToV2Response);
  }

  private mapToV2Response(user: User): UserResponseV2 {
    return {
      id: user.id,
      firstName: user.firstName,  // v2 splits name
      lastName: user.lastName,
      email: user.email,  // v2 renames field
      phone: user.phoneNumber,  // v2 adds phone
    };
  }
}
```

---

## Quality Checklist

```
[ ] One controller per version (v1/, v2/)
[ ] DTOs versioned per folder
[ ] v2 maps to a DIFFERENT response shape
```
