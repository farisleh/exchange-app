# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Environment

Create a .env file in your project root with your database connection string:

```bash
# .env
DATABASE_URL=postgres://user:password@db:5432/forex
```

## Docker

To run the app and PostgreSQL with Docker:

```bash
# .docker-compose
docker-compose up --build
```
- PostgreSQL will be available at localhost:5434
- Nuxt app will run on http://localhost:3000

To stop Docker containers:

```bash
# .docker-compose
docker-compose down
```

## Database Commands (Drizzle ORM)

Generate migrations after schema changes:

```bash
pnpm run db:generate
```

Run migrations to update your database:

```bash
pnpm run db:migration
```

Drop database schema (use with caution):

```bash
pnpm run db:drop
```

Check migration status:

```bash
pnpm run db:check
```

Seed the database with initial data:

```bash
pnpm run db:seed
```

## Testing

Run unit tests with Vitest:

```bash
npx vitest
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
