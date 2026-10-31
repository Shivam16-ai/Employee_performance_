# EPMS Enterprise Backend — Phase 1: Foundation Setup

Production-grade asynchronous backend service for the **Employee Performance Management System (EPMS)** built with Python, FastAPI, PostgreSQL, SQLAlchemy 2.0, Alembic, and Pydantic.

---

## 1. Technology Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (>=0.115.0)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (>=0.32.0) with uvloop & httptools
- **ORM & Core**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with asynchronous engine support
- **Async Driver**: [asyncpg](https://github.com/MagicStack/asyncpg) (>=0.30.0)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/) (>=1.14.0) with async runner
- **Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **Testing**: [Pytest](https://docs.pytest.org/), [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio), [HTTPX](https://www.python-httpx.org/)

---

## 2. Architecture & Directory Taxonomy

The backend is structured into domain-specific, decoupled modules:

```
backend/
├── alembic/                      # Database migration scripts & environment
│   ├── env.py                    # Async migration engine runner
│   ├── script.py.mako            # Migration template
│   └── versions/                 # Version-controlled migration revisions
├── alembic.ini                   # Alembic configuration
├── app/                          # Core application package
│   ├── api/                      # Routing and API dependencies
│   │   ├── deps.py               # Reusable FastAPI dependencies (db session)
│   │   └── v1/
│   │       ├── router.py         # Consolidated API v1 router
│   │       └── endpoints/
│   │           └── health.py     # Health and monitoring endpoints
│   ├── core/                     # Cross-cutting foundational modules
│   │   ├── config.py             # Typed Pydantic settings & env validation
│   │   ├── exceptions.py         # Centralized exception handlers & error responses
│   │   └── logging.py            # Structured JSON / human-readable logging
│   ├── db/                       # Database engine and session lifecycle
│   │   ├── base.py               # SQLAlchemy 2.0 DeclarativeBase
│   │   └── session.py            # Async engine, connection pool, and ping utility
│   ├── models/                   # Database ORM models (DeclarativeBase)
│   │   └── base.py               # TimestampedModel mixin (UUID primary key)
│   ├── schemas/                  # Pydantic request/response schemas
│   │   └── health.py             # HealthCheck and DatabaseHealth schemas
│   ├── services/                 # Business logic and domain services
│   │   └── health_service.py     # System health and ping evaluator
│   ├── repositories/             # Asynchronous data access layer
│   │   └── base.py               # Generic async CRUD BaseRepository
│   ├── analytics/                # Performance analytics and metric aggregations
│   │   └── metrics.py            # System metrics registry
│   └── main.py                   # FastAPI application factory & lifespan context
├── tests/                        # Automated Pytest suite
│   ├── conftest.py               # Async client fixture and test setup
│   ├── test_health.py            # Health endpoint integration tests
│   └── test_db_connection.py     # Database connectivity tests
├── .env                          # Local environment secrets (not committed)
├── .env.example                  # Environment configuration template
├── pyproject.toml                # Project metadata and test configuration
└── requirements.txt              # Pinned Python package dependencies
```

---

## 3. Environment Configuration

Copy the sample environment file to create your local `.env`:

```bash
cp backend/.env.example backend/.env
```

### Core Configuration Parameters

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `development` | Operating tier (`development`, `staging`, `production`) |
| `DEBUG` | `true` | Enables interactive debugging and OpenAPI schema |
| `PORT` | `8001` | Server listening port |
| `CORS_ORIGINS` | `["http://localhost:3000", ...]` | Allowed CORS origins for the React frontend |
| `DATABASE_URL` | `postgresql+asyncpg://...` | Asynchronous SQLAlchemy connection string |
| `SYNC_DATABASE_URL` | `postgresql+psycopg2://...` | Synchronous SQLAlchemy string for migrations |
| `DB_POOL_SIZE` | `10` | SQLAlchemy connection pool baseline size |
| `DB_MAX_OVERFLOW` | `20` | Max overflow connections allowed under peak load |
| `LOG_LEVEL` | `INFO` | Logger verbosity level |

---

## 4. Setup & Installation Instructions

### Step 1: Create Virtual Environment

```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Step 3: Configure PostgreSQL

1. Install PostgreSQL if not already installed:
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```
2. Start the PostgreSQL cluster:
   ```bash
   sudo pg_ctlcluster 15 main start
   ```
3. Provision the database and dedicated application user:
   ```bash
   sudo -u postgres psql -c "CREATE USER epms_user WITH PASSWORD 'epms_secure_password';"
   sudo -u postgres psql -c "CREATE DATABASE epms_db OWNER epms_user;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE epms_db TO epms_user;"
   ```

### Step 4: Run Alembic Database Migrations

```bash
cd backend
alembic upgrade head
```

---

## 5. Running the Application

Launch the development server with live reload:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Interactive documentation:
- **Swagger UI**: `http://localhost:8001/api/v1/docs`
- **ReDoc UI**: `http://localhost:8001/api/v1/redoc`
- **OpenAPI Schema**: `http://localhost:8001/api/v1/openapi.json`

---

## 6. Endpoints Reference

### 1. Root Service Information
- **Method**: `GET /`
- **Response**:
  ```json
  {
    "service": "EPMS Enterprise Backend",
    "version": "1.0.0",
    "status": "operational",
    "docs": "/api/v1/docs",
    "health": "/api/v1/health"
  }
  ```

### 2. Comprehensive Health Check
- **Method**: `GET /api/v1/health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "app_name": "EPMS Enterprise Backend",
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2026-10-30T16:45:00.000000Z",
    "database": {
      "status": "connected",
      "latency_ms": 1.25,
      "dialect": "postgresql",
      "driver": "asyncpg",
      "error": null
    },
    "system": {
      "python_version": "3.10.12",
      "platform": "Linux-..."
    }
  }
  ```

### 3. Dedicated Database Ping
- **Method**: `GET /api/v1/health/db`
- **Response**:
  ```json
  {
    "status": "connected",
    "latency_ms": 1.15,
    "dialect": "postgresql",
    "driver": "asyncpg",
    "error": null
  }
  ```

---

## 7. Running Automated Tests

Run the test suite with verbose output:

```bash
cd backend
pytest tests -v
```
