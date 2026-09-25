# SMS/Notification Integration

The SNS SDK is wrapped by an `SmsService` that classifies errors.

---

## SmsService

```typescript
// libs/sms_notification/src/services/sms.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { SNS } from 'aws-sdk';

@Injectable()
export class SmsService {
  constructor(@Inject(SMS_TOKEN) private readonly snsClient: SNS) {}

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.snsClient.publish({ PhoneNumber: phoneNumber, Message: message, MessageStructure: 'string' }).promise();
    } catch (error) {
      throw new SmsNotificationException(`Failed to send SMS: ${error.message}`, error.code);
    }
  }
}
```

---

## Quality Checklist

```
[ ] SDK behind service
[ ] Errors classified
```
