# DesignFlow AI Backend

This is the Node.js/Express backend for DesignFlow AI.

## Tech Stack
- **Node.js** with **TypeScript**
- **Express.js** (Web Framework)
- **PostgreSQL** + **Prisma** (Database & ORM)
- **Zod** (Validation)
- **Pino** (Structured Logging)

## Architecture
We follow a layered architecture:
`Routes -> Controllers -> Services -> Repositories -> Prisma -> PostgreSQL`

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup:**
   Run Prisma migrations to setup your database schema.
   ```bash
   npm run prisma:migrate
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production Build
   npm run build
   npm start
   ```

## Development Commands
- `npm run dev`: Starts the server in development mode with hot-reloading.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` directory.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run test`: Runs Jest for unit testing.
