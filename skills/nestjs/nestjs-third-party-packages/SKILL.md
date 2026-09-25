---
name: nestjs-third-party-packages
description: Third-party integration patterns for NestJS. Covers AWS services (S3, SNS, SES), payment providers, and external API integration. Use when integrating external services, implementing AWS patterns, or connecting to payment processors.
---

# NestJS Third-Party Package Integration

Services integrate with external systems (AWS S3, AWS SNS, banks, payment processors). Each integration follows patterns for abstraction, error handling, and retry logic.

## Why Abstraction Matters

See `references/why-abstraction.md` for the ❌ BAD direct-AWS-SDK example and the ✅ GOOD abstract-interface example.

---

## Library Structure

See `references/library-structure.md` for the `storage_cdn` folder layout.

---

## AWS S3 Adapter

See `references/s3-adapter.md` for the `getS3Client` provider and the `StorageService`.

---

## SMS/Notification Integration

See `references/sms-notification.md` (`SmsService`).

---

## Options Pattern

See `references/options-pattern.md` (`StorageOptions`, `StorageOptionsFactory`, `StorageAsyncOptions`).

---

## Module Registration with Async Options

See `references/module-async-options.md` (`StorageCoreModule.registerAsync`).

---

## DI Decorator

See `references/di-decorator.md` (`InjectStorage`).

---

## Exception Handling

See `references/exceptions.md` (`StorageException` hierarchy).

---

## Consumer Usage

See `references/consumer-usage.md` (module registration + service usage).

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (no error classification, no retry, hardcoded credentials, sync blocking).

---

## Summary: Third-Party Integration

| Component | Responsibility |
|-----------|----------------|
| Options Interface | Configuration structure |
| Service Port | Abstract interface |
| Provider (S3/SNS/etc) | Third-party SDK wrapper |
| Exceptions | Classified error handling |
| Async Module | Dynamic configuration |

**Golden rule**: Abstract the SDK. Your services depend on interfaces, not specific providers. Change provider = new adapter, same interface.
