# EPMS — Enterprise Performance Management System Backend (Node.js)

High-performance, modular enterprise backend built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM 7 (Stable)**, and **PostgreSQL**.

---

## Architecture Overview

- **Runtime:** Node.js (v24.x LTS / Current)
- **Framework:** Express 4.x with TypeScript (ESM)
- **Database ORM:** Prisma ORM `7.10.1` (Stable)
- **Database Engine:** PostgreSQL 18.x
- **Connection Adapter:** `@prisma/adapter-pg` with native `pg.Pool` connection pooling
- **Validation:** Zod v3
- **Security:** Helmet & configured CORS for frontend integration
- **Testing:** Vitest & Supertest

---

## Folder Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   │   └── 20261031040855_init_system_foundation/
│   │       └── migration.sql
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   └── healthController.ts
│   ├── generated/
│   │   └── prisma/             # Prisma 7 generated client
│   ├── lib/
│   │   └── prisma.ts           # Singleton Prisma client & db adapter
│   ├── middleware/
│   │   ├── errorHandler.ts     # Centralized AppError & Zod error handling
│   │   └── validate.ts         # Zod request validation middleware
│   ├── repositories/           # Data access layer (Phase 2)
│   ├── routes/
│   │   ├── healthRoutes.ts
│   │   └── index.ts            # API v1 router
│   ├── services/
│   │   └── healthService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── app.ts                  # Express application factory
│   └── server.ts               # HTTP listener & graceful shutdown
├── tests/
│   └── health.test.ts          # Vitest suite
├── .env                        # Local environment variables
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts            # Prisma 7 configuration file
├── tsconfig.json
└── README.md
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma 7 Client
```bash
npm run prisma:generate
```

### 3. Run Database Migrations
```bash
npm run prisma:migrate
```

### 4. Run Development Server
```bash
npm run dev
```
Server runs at `http://localhost:8001`.

### 5. Run Test Suite
```bash
npm test
```

### 6. Build & Run Production Bundle
```bash
npm run build
npm start
```

---

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service info & health links |
| `GET` | `/api/v1/health` | Comprehensive system & database health |
| `GET` | `/api/v1/health/db` | Direct PostgreSQL latency & ping check |

---

## Rollback & FastAPI Recovery Instructions

The previous Python FastAPI backend and Alembic migration state have been completely preserved under:
`backend-python-archive/`

### To rollback to the Python FastAPI backend:
1. Stop the Node.js server.
2. The original FastAPI files and virtual environment remain intact at:
   - Root project: `backend-python-archive/`
   - Virtualenv: `test_venv/`
   - Alembic versions: `backend-python-archive/alembic/versions/`
3. Initial database schema dump is archived at:
   - `backend-python-archive/db_backup/epms_prisma_dev_initial.sql`
4. To restore:
   ```powershell
   Copy-Item -Path "backend-python-archive/*" -Destination "backend" -Recurse -Force
   ```
