# Event Consumers

Consumers subscribe to topics and dispatch commands to handle the event. Each service uses its own consumer group.

---

## Consumer Service Pattern

```typescript
// apps/notification/src/notification/infrastructure/queue/listeners/user-event-consumer.service.ts
@Injectable()
export class UserEventConsumerService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
  ) {}

  public onModuleInit(): void {
    this.userCreated();
  }

  private userCreated(): void {
    const maxRetries = this.configService.get<number>('kafka.maxTries')!;
    const retryDelayMs = this.configService.get<number>('kafka.retryDelayMs')!;

    this.queueService.consume(
      TopicConstant.USER_CREATED,  // Topic name from constants
      async (message: UserCreatedMessage): Promise<void> => {
        // Dispatch command to handle the event
        await this.commandBus.execute(
          new SendEmailNotificationCommand(
            [message.email],
            'Bienvenido a la plataforma',
            TemplateNamesEnum.USER_CREATED,
            {
              fullName: message.fullName,
              code: message.code,
            },
          ),
        );
      },
      KafkaGroupsConstant.NOTIFICATION_GROUP,  // Consumer group
      maxRetries,
      retryDelayMs,
    );
  }
}
```

**Why `OnModuleInit`**: Register consumers when module initializes. Keeps registration in one place.

---

## Cross-Service Event Consumption

```typescript
// apps/merchant/src/merchant/infrastructure/queue/listeners/authentication-event-consumer.service.ts
// Merchant listens to Authentication events

@Injectable()
export class AuthenticationEventConsumerService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
  ) {}

  public onModuleInit(): void {
    this.userActivatedSuccessfully();
  }

  private userActivatedSuccessfully(): void {
    const maxRetries = this.configService.get<number>('kafka.maxRetries')!;
    const retryDelayMs = this.configService.get<number>('kafka.retryDelayMs')!;

    this.queueService.consume(
      TopicConstant.USER_ACTIVATED,  // From authentication service
      async (message: UserActivatedMessage): Promise<void> => {
        // Create merchant user when auth user is activated
        await this.commandBus.execute(
          new CreateInitialMerchantUserCommand(
            message.userId,
            message.firstName,
            message.lastName,
            message.phoneNumber,
            message.phoneCountry,
            message.email,
            message.username,
            message.type,
          ),
        );
      },
      KafkaGroupsConstant.MERCHANT_GROUP,
      maxRetries,
      retryDelayMs,
    );
  }
}
```

**Why separate consumer group**: Multiple services can consume same event. Each has own consumer group.

---

## Quality Checklist

```
[ ] Consumers registered on module init
[ ] Consume dispatches a command (not business logic)
[ ] Each service has its own consumer group
[ ] Retry configured
```
