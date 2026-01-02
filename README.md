
# Furever Home Deployment Guide

## Quick Reference

| Environment | Backend | Frontend |
|-------------|---------|----------|
| **Local** | `docker-compose up` | `pnpm dev --filter=customer_front` |
| **Staging** | Push to `staging` branch | N/A |
| **Production** | Push to `main` branch | Push to `main` branch |

---

## Local Development

```bash
# Start all services (Postgres, Redis, Mailhog, MinIO)
docker-compose up -d

# Run backend
pnpm dev --filter=customer_backend

# Run frontend
pnpm dev --filter=customer_front
```

**Services:**
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Mailhog UI: http://localhost:8025
- MinIO Console: http://localhost:9001

---

## Staging Deployment

**Automatic**: Push to `staging` branch triggers:
1. Docker build → GHCR (`customer-backend-staging`)
2. Render deployment via GitHub Action

```bash
git checkout staging
git merge <feature-branch>
git push origin staging
```

---
## Production Deployment

**Backend**: Push to `main` triggers:
1. Docker build → GHCR (`customer-backend:latest`)
2. Render webhook deployment

**Frontend**: Push to `main` triggers:
1. Vercel build & deploy

```bash
git checkout main
git merge staging
git push origin main
```

---

## Required Secrets (GitHub)

**Backend:**
- `GHCR_TOKEN` - GitHub Container Registry token
- `RENDER_DEPLOY_HOOK_URL` - Render webhook (prod)
- `RENDER_API_KEY` - Render API key (staging)
- `RENDER_SERVICE_ID` - Render service ID (staging)

**Frontend:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_CUSTOMER_PROJECT_ID`

---

## Manual Render Deploy

```bash
# Trigger via webhook
curl -X POST $RENDER_DEPLOY_HOOK_URL
```

---

## Health Check

```bash
curl https://your-backend-url/health
```

---

## Key Files

- `.github/workflows/prod.yml` - Production backend
- `.github/workflows/stg.yml` - Staging backend
- `.github/workflows/vercel-customer.yml` - Frontend
- `apps/backend/customer/Dockerfile` - Backend image
- `docker-compose.yaml` - Local services
- `render.yaml` - Render config
