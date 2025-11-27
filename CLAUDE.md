# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Turborepo monorepo for **Furever Home**, a pet adoption platform. The codebase uses pnpm workspaces with a clear separation between frontend (Next.js), backend (NestJS), and shared packages.

## Commands

### Development
```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter=customer_front
pnpm dev --filter=customer_backend
```

### Building
```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm build --filter=customer_front
pnpm build --filter=customer_backend
```

### Linting and Type Checking
```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format all code
pnpm format

# Frontend-specific linting (apps/frontend/customer)
cd apps/frontend/customer
pnpm eslint              # Check for ESLint errors
pnpm eslint:fix          # Auto-fix ESLint errors
```

### Backend-Specific Commands (apps/backend/customer)
```bash
# Run backend in development mode
cd apps/backend/customer
pnpm start:dev

# Run backend in production mode
pnpm start:prod

# Run tests
pnpm test
pnpm test:watch
pnpm test:cov
pnpm test:e2e
```

### Database Commands (packages/database)
```bash
cd packages/database

# Generate migration files from schema
pnpm db:generate

# Push schema changes to database
pnpm db:migrate

# Seed database with initial data
pnpm db:seed

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

### Docker
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d
```

## Architecture

### Monorepo Structure
- **apps/backend/customer**: NestJS backend API
- **apps/frontend/customer**: Next.js frontend application
- **packages/database**: Drizzle ORM database schemas and client
- **packages/api/customer**: ts-rest API contracts shared between frontend and backend
- **packages/ui**: Shared React component library (Radix UI + Tailwind)
- **packages/utils**: Shared utility functions
- **packages/eslint-config**: Shared ESLint configuration
- **packages/typescript-config**: Shared TypeScript configuration

### Backend (NestJS + Fastify)

**Location**: `apps/backend/customer`

- **Framework**: NestJS with Fastify adapter
- **API Contract**: Uses `@ts-rest` for type-safe API definitions shared with frontend
- **Database**: Drizzle ORM with PostgreSQL (Supabase)
- **Authentication**: JWT-based auth with passport-jwt and passport-local strategies
- **Queue System**: BullMQ with Redis for background jobs (email queue)
- **Logging**: Pino logger with pretty printing
- **Email**: AWS SES via @nestjs-modules/mailer
- **Storage**: S3-compatible storage (nestjs-s3)

**Module Structure** (`src/modules/`):
- `app`: Root application module
- `auth`: Authentication and authorization
- `customer`: Customer domain logic
- `database`: Database connection module
- `email`: Email service
- `email_queue`: Background email processing

**Common Infrastructure** (`src/common/`):
- `config`: Configuration management with validation
- `constants`: Shared constants
- `decorators`: Custom decorators
- `exception_filters`: Global error handling (AllExceptions, HttpExceptions, Zod, RequestDto, ResponseDto)
- `guards`: Auth guards and role-based access control
- `interceptors`: Logging interceptor
- `strategies`: Passport authentication strategies
- `utils`: Shared utilities

**Entry Point**: `src/main.ts` - Bootstraps NestJS app on port from config, sets up Fastify with CORS, error filters, and Pino logging.

### Frontend (Next.js 14)

**Location**: `apps/frontend/customer`

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: Jotai for client state
- **Forms**: React Hook Form with Zod validation
- **API Client**: ts-rest client consuming contracts from `customer_api` package
- **Authentication**: JWT stored in cookies, middleware-based route protection
- **Image Handling**: Cloudinary via next-cloudinary

**Route Structure** (`src/app/`):
- `(auth)/*`: Authentication routes (login, register, forgot-password, verify) - redirects to home if authenticated
- `(main)/*`: Protected main application routes (home, donation, faq, image upload)
- `api/*`: API route handlers
- `_layout`: Shared layout components

**Server Actions Pattern**:
- Server Actions are used for cookie management and other server-side operations
- Located in `actions.ts` files within route folders (e.g., `(auth)/register/actions.ts`)
- Common use cases: setting HTTP-only cookies, server-side data mutations
- Example: `setRegistrationEmailCookie()`, `setResetEmailCookie()`

**Middleware** (`src/middleware.ts`):
- `authRoutesGuard`: Redirects authenticated users away from auth pages
- `protectedRoutesGuard`: Redirects unauthenticated users to login

**Configuration**:
- Environment variables validated via `@t3-oss/env-nextjs` in `src/env.ts`
- Next.js config in `next.config.mjs` with standalone output for Docker

### Database Package

**Location**: `packages/database`

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Supabase (PostgreSQL)
- **Client**: Initialized in `src/client.ts`, requires `SUPABASE_DATABASE_URL` environment variable
- **Migrations**: Generated to `src/migrations/`, schemas defined in `src/schemas/`

**Database Tables** (`src/schemas/`):
- `customers`: User accounts
- `customer_accounts`: OAuth/social accounts
- `customer_settings`: User preferences
- `pets`: Pet information
- `pet_medical_records`: Medical history
- `pet_preferences`: Adoption preferences
- `pet_extra_informations`: Additional pet details
- `adoption_posts`: Available pets for adoption
- `adoption_applications`: Adoption requests
- `adoption_transactions`: Adoption completion records
- `enums/`: Shared enum definitions

### API Contracts Package

**Location**: `packages/api/customer`

- **Purpose**: Type-safe API contract definitions shared between frontend and backend
- **Library**: `@ts-rest/core`
- **Structure**:
  - `src/contracts/`: API endpoint definitions
  - `src/models/`: Request/response models
  - `src/schemas/`: Zod validation schemas derived from Drizzle schemas (using drizzle-zod)
- **Build**: Outputs to `dist/` with CommonJS and ESM formats

This package is the single source of truth for API types, ensuring frontend and backend stay in sync.

### Shared Packages

**UI Package** (`packages/ui`):
- Radix UI primitives styled with Tailwind
- shadcn/ui component patterns
- Components exported from `components/` directory
- Shared hooks in `hooks/`

**Utils Package** (`packages/utils`):
- Shared utility functions
- Date formatting utilities (date-fns)
- Tailwind class merging utilities

## Key Technical Patterns

### Type-Safe API Communication
Frontend and backend communicate through `@ts-rest` contracts defined in `packages/api/customer`. The frontend uses two approaches:
1. **Direct API calls**: Using ts-rest client for backend API requests (e.g., login, registration)
2. **Server Actions**: Next.js Server Actions for server-side operations (e.g., cookie management)

Changes to API contracts automatically update both client and server types.

### Authentication Flow
1. User logs in via `/api/auth/login` endpoint (backend)
2. Backend returns JWT token
3. Frontend stores token in HTTP-only cookie
4. Middleware (`src/middleware.ts`) validates session on protected routes
5. Backend validates JWT using passport-jwt strategy

### Database Workflow
1. Define/update schemas in `packages/database/src/schemas/`
2. Run `pnpm db:generate` to create migration files
3. Run `pnpm db:migrate` to apply migrations to database
4. (Optional) Run `pnpm db:seed` to populate with test data
5. Update Zod schemas in `packages/api/customer/src/schemas/` using drizzle-zod

### Shared Component Development
1. Create components in `packages/ui/components/`
2. Export from `packages/ui/index.ts`
3. Import in frontend: `import { Button } from "ui"`

## Environment Variables

### Backend (`apps/backend/customer/.env`)
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_DATABASE_URL`: Supabase-specific connection string
- Redis connection for BullMQ
- AWS SES credentials
- S3/MinIO credentials
- JWT secrets

### Frontend (`apps/frontend/customer/.env`)
- Next.js public and server environment variables
- API endpoint URLs
- OAuth client IDs (Google)
- Cloudinary credentials

### Database Package (`packages/database/.env`)
- `DATABASE_URL`: Used for Drizzle migrations

## Docker

The `docker-compose.yaml` defines:
- `customer_backend`: NestJS backend container (port 3001)
- `minio`: S3-compatible object storage (ports from env)
- Network: `app_network` (external)

Backend health check: `curl -f localhost:3001/health`

## Important Notes

- **Package Manager**: Must use `pnpm` (specified in `package.json` with `packageManager: "pnpm@9.0.0"`)
- **Node Version**: Requires Node.js >= 18
- **TypeScript**: Monorepo uses TypeScript 5.8.2
- **Turborepo**: Build caching is enabled but cache is set to false for build and dev tasks
- **API Versioning**: API contracts should be updated in `packages/api/customer` before implementation
- **Database Changes**: Always generate migrations, never modify migration files directly
