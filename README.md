# Quantergy

## Tech Stack

- Next.js 16 with App Router.
- React 19.
- TypeScript 5.
- Prisma 6 as the ORM.
- PostgreSQL 16 for persistence.
- Docker Compose for the local database.
- Recharts for charts.
- Radix UI, shadcn/ui, Tailwind CSS 4, and CSS Modules for UI and styling.
- ESLint 9 for static analysis.

## Requirements

- Node.js 20 or newer.
- npm.
- A container runtime compatible with Docker Compose:
  - macOS: Rancher Desktop is recommended. Use the `dockerd / Moby` engine.
  - Windows: Docker Desktop with WSL 2 is recommended.

On macOS, if Rancher Desktop is installed but the `docker` command is not available in your terminal, make sure `~/.rd/bin` is in your `PATH` or open a new terminal after starting Rancher Desktop.

## Environment Variables

Create your local environment file from the example:

```bash
cp .env.example .env
```

Then edit `.env` with your local values.

Do not commit `.env`. It may contain local credentials or other environment-specific values. Only `.env.example` should be committed as documentation for the required variables.

## Running The Project

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

Seed the database with initial data:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Useful Commands

Check the database container status:

```bash
docker compose ps
```

Stop PostgreSQL without deleting local data:

```bash
docker compose stop postgres
```

Stop PostgreSQL and delete the local data volume:

```bash
docker compose down -v
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Run the linter:

```bash
npm run lint
```

The project includes sample JSON files in `samples/` for testing prediction uploads from the upload screen. There is one invalid upload sample and one valid upload sample per demo client.
