FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g corepack@latest
RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# Prune the workspace for the app
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=customer_backend --docker

# Copy source code of pruned subworkspace and build
FROM base AS builder
WORKDIR /app

ENV REDISMS_DISABLE_POSTINSTALL=1
COPY --from=pruner /app/out/json/ .
RUN pnpm install

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=customer_backend

FROM node:22-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup -S -g 1001 nodejs
RUN adduser -S -G nodejs -u 1001 nestjs
USER nestjs

COPY --from=builder /app .

CMD node apps/backend/customer/dist/src/main.js
