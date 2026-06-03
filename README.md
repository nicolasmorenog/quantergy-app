# Wattrgy

Wattrgy is a Next.js dashboard for viewing, managing, and uploading energy
prediction data. It includes demo clients, role-based access, prediction charts,
historical tables, and an admin-only upload workflow backed by PostgreSQL and
Prisma.

## Project Context

Wattrgy was developed as an academic portfolio project originally designed for a
Spanish energy advisory startup. The project is not currently affiliated with,
operated by, or commercially endorsed by any active company.

## Main Features

- Authenticated dashboard for prediction KPIs and charts.
- Client-scoped views for client users.
- Prediction history and comparison views.
- Admin access to upload, review, and delete prediction data.
- Seeded demo data and sample upload payloads for local testing.

## Tech Stack

- Next.js 16 with App Router.
- React 19.
- TypeScript 5.
- Prisma 6 as the ORM.
- PostgreSQL 16 for persistence.
- Docker Compose for the local database.
- Recharts for charts.
- Radix UI, Shadcn UI, Tailwind CSS 4, and CSS Modules for UI and styling.
- ESLint 9 and Vitest for static analysis and tests.

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

Required variables:

- `POSTGRES_DB`: local PostgreSQL database name.
- `POSTGRES_USER`: local PostgreSQL username.
- `POSTGRES_PASSWORD`: local PostgreSQL password.
- `POSTGRES_PORT`: local PostgreSQL port exposed on the host.
- `DATABASE_URL`: Prisma connection string.
- `AUTH_SECRET`: secret used to sign session cookies. Use a long random value,
  especially outside local development.

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

The seed creates demo clients, predictions, and the following local users:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@wattrgy.com` | `admin123` |
| Client | `client1@wattrgy.com` | `client123` |
| Client | `client2@wattrgy.com` | `client789` |

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

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

Check dependency vulnerabilities:

```bash
npm audit
```

## Sample Uploads

The project includes sample JSON files in `samples/` for testing prediction uploads from the upload screen. There is one invalid upload sample and one valid upload sample per demo client.
