# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A NestJS boilerplate application with authentication, email verification, password reset, and role-based access control. Built with Prisma ORM (PostgreSQL), BullMQ for job processing, and Mailjet for email delivery.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development services (PostgreSQL + Redis)
docker compose up -d

# Development
pnpm run start:dev          # Watch mode with hot reload
pnpm run start:debug        # Debug mode with watch

# Build and production
pnpm run build
pnpm run start:prod

# Testing
pnpm run test               # Run all unit tests
pnpm run test:watch         # Watch mode
pnpm run test:cov           # With coverage report
pnpm run test:e2e           # End-to-end tests
pnpm run test:debug         # Debug mode for tests

# Code quality
pnpm run lint               # ESLint with auto-fix
pnpm run format             # Prettier formatting

# Database
npx prisma migrate dev      # Create and apply migration
npx prisma generate         # Generate Prisma Client
npx prisma studio           # Open Prisma Studio GUI
```

## Architecture

### Module Structure

The application follows NestJS modular architecture with clear separation of concerns:

- **AuthModule**: Authentication, JWT tokens, email verification, password reset
  - Uses `forwardRef()` with MailModule to break circular dependency
  - Integrates UserModule, BcryptModule, PrismaModule

- **UserModule**: User management with role-based access (USER, ADMIN)
  - Exports UserService for use by AuthModule

- **MailModule**: Email delivery via BullMQ queue
  - Queue name: `mailQueue` with concurrency of 10
  - Jobs: `send-reset-password`, `send-verification-email`
  - Uses Mailjet as the email service provider

- **BcryptModule**: Password hashing service wrapper

- **PrismaModule**: Database access layer

### Authentication System

**JWT-based authentication** with role-based authorization:

- Global JWT configuration in [app.module.ts:29-33](src/app.module.ts#L29-L33)
- Token expiration: 60 seconds (configured for development)
- AuthGuard checks:
  1. Authorization header presence
  2. JWT validity and expiration
  3. Role-based access (uses `@Roles()` decorator)
  4. ADMIN role always has access to protected routes

**Guards and Decorators:**
- `@UseGuards(AuthGuard)` - Protects routes requiring authentication
- `@Roles('USER', 'ADMIN')` - Restricts access by role (ADMIN bypasses all role checks)
- `@AuthenticatedUser()` - Injects authenticated user from request

### Email System

**Asynchronous email processing** using BullMQ:

1. MailService enqueues jobs to `mailQueue`
2. MailConsumer processes jobs in background with concurrency of 10
3. Email templates include token links to `FRONTEND_URL` environment variable
4. Mailjet is used as the email service provider

**Job types:**
- `send-reset-password`: Password reset link with 24-hour token
- `send-verification-email`: Email verification link with 24-hour token

### Token Management

**Two token types** stored in database (not JWT):

- `RESET_PASSWORD`: 24-hour expiration for password resets
- `EMAIL_VERIFICATION`: 24-hour expiration for email verification

**Lifecycle:**
- Generated: One active token per type per user (old ones deleted)
- Validated: Type check + expiration check in auth service
- Cleaned: ClearTokenCron runs hourly via `@Cron(CronExpression.EVERY_HOUR)` in [clear-token.cron.ts:9](src/auth/clear-token.cron.ts#L9)

### Database

**Prisma ORM** with custom configuration:

- Client generated to `generated/prisma/` (not default `node_modules/.prisma`)
- Module format: CommonJS
- Connection: PostgreSQL via `DATABASE_URL`
- Models: User (with roles), Token (with types)

**Import Prisma Client from:** `generated/prisma/client`

## Environment Setup

Required variables (see [.env.example](.env.example)):

```env
DATABASE_URL="postgres connection string"
JWT_SECRET="your_jwt_secret_key"
FRONTEND_URL="http://localhost:5000"  # For email verification/reset links
MAILJET_API_KEY="mailjet api key"
MAILJET_API_SECRET="mailjet api secret"
```

## Key Implementation Patterns

### Module Dependencies

Watch for circular dependencies - use `forwardRef()` when modules import each other:
```typescript
imports: [forwardRef(() => MailModule)]
```

### Custom Prisma Client Location

Always import from custom path:
```typescript
import { User, Token } from 'generated/prisma/client';
```

### Role-Based Access

AuthGuard automatically grants ADMIN access to all role-protected routes:
```typescript
const allowedRoles = [...roles, 'ADMIN'];  // ADMIN bypasses role checks
```

### Global Validation

ValidationPipe enabled globally in [main.ts:7](src/main.ts#L7) - all DTOs are automatically validated with class-validator.

### Background Jobs

BullMQ connection configured globally to Redis at localhost:6379 in [app.module.ts:22-27](src/app.module.ts#L22-L27).

## Testing Notes

- Jest configuration in package.json with `rootDir: "src"`
- Test files: `*.spec.ts` pattern
- Coverage output: `coverage/` directory
- E2E tests: Separate config at `test/jest-e2e.json`
