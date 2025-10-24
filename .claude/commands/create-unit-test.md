---
description: Generate unit tests for backend services with mocks
allowed-tools: Task
---

Use the **nestjs-test-reviewer** agent to generate comprehensive unit tests for the backend service: **$1**

## Task for Agent:

Generate comprehensive unit tests for the service at `apps/backend/customer/src/modules/$1/$1.service.ts`

Create a test file at `apps/backend/customer/src/modules/$1/$1.service.spec.ts` with:
- Proper NestJS testing setup with `Test.createTestingModule()`
- Mock all external dependencies (database, other services, repositories)
- Mock Drizzle ORM database connections using Jest mocks
- Test all public methods with success and error cases
- Use proper TypeScript types (no `any` types)
- Include beforeEach and afterEach hooks for cleanup
- Mock all third-party services (email, S3, Redis/BullMQ, etc.)
- Follow NestJS testing best practices
- Use descriptive test names with `describe` and `it` blocks
- Aim for high code coverage

After creating the tests, run `pnpm test` to verify they compile and pass.
