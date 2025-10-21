# Database Seeding

This guide explains how to seed your database with dummy data for development and testing.

## Prerequisites

1. PostgreSQL database running (via Docker or locally)
2. Environment variables configured in `packages/database/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/furever_home
   ```

## Quick Start

### 1. Install Dependencies

From the project root:
```bash
pnpm install
```

### 2. Run Migrations

Make sure your database schema is up to date:
```bash
cd packages/database
pnpm db:migrate
```

### 3. Seed the Database

Run the seed script:
```bash
pnpm db:seed
```

## What Gets Created

The seed script creates the following dummy data:

### Customers (5 users)
- John Smith (john.smith@example.com)
- Sarah Johnson (sarah.johnson@example.com)
- Michael Chen (michael.chen@example.com)
- Emily Rodriguez (emily.rodriguez@example.com)
- David Williams (david.williams@example.com)

**Note**: All accounts use the password `password123` (hashed). You'll need to update the `HASHED_PASSWORD` constant in `src/seed.ts` with a real bcrypt hash.

### Pets (6 pets)
- **Max** - Golden Retriever, large, adopting
- **Luna** - Cat, small, adopting
- **Bella** - Beagle, medium, adopting
- **Charlie** - Husky, large, adopting
- **Whiskers** - Tabby Cat, medium, has owner
- **Buddy** - Labrador, medium, adopting (senior dog)

### Other Data
- 5 Customer accounts with authentication
- 5 Customer settings
- 4 Pet preferences
- 6 Pet extra information records
- 6 Pet medical records
- 5 Pet images
- 5 Adoption posts
- 5 Adoption applications (various statuses)
- 1 Completed adoption transaction
- 1 Adoption review
- 5 Messages between users
- 5 Favorites

## Customizing the Seed Data

### Update Password Hash

To create a real password hash for testing:

```typescript
import bcrypt from 'bcrypt';

const hash = await bcrypt.hash('password123', 10);
console.log(hash);
```

Then update the `HASHED_PASSWORD` constant in `src/seed.ts`.

### Modify Data

Edit `src/seed.ts` to:
- Add more customers, pets, or other records
- Change the data values
- Add custom scenarios for testing

## Using with Docker

If you're using the Docker PostgreSQL container:

1. Start the database:
   ```bash
   docker-compose up postgres -d
   ```

2. Wait for the database to be ready:
   ```bash
   docker-compose ps
   ```

3. Run migrations and seed:
   ```bash
   cd packages/database
   pnpm db:migrate
   pnpm db:seed
   ```

## Resetting the Database

To clear all data and re-seed:

```bash
cd packages/database

# Push schema (this will reset)
pnpm db:migrate

# Re-seed
pnpm db:seed
```

## Troubleshooting

### Connection Error
If you get a connection error:
- Verify PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Ensure the database exists

### Foreign Key Errors
The seed script deletes data in the correct order to handle foreign key constraints. If you modify the script, ensure you maintain the proper deletion order (reverse of creation).

### "Table does not exist" Error
Run migrations first:
```bash
pnpm db:migrate
```

## Development Tips

1. **Use Drizzle Studio** to visually inspect seeded data:
   ```bash
   pnpm studio
   ```

2. **Test Authentication** with any of the seeded accounts:
   - Email: `john.smith@example.com`
   - Password: `password123` (after updating the hash)

3. **Test Adoption Flow**:
   - Browse adoption posts for Max, Luna, Bella, Charlie, or Buddy
   - Create applications as different users
   - Exchange messages between applicants and owners

4. **Test Reviews**:
   - Luna has a completed adoption with a 5-star review
