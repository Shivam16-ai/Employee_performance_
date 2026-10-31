import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.core.logging import setup_logging
from backend.app.core.exceptions import register_exception_handlers
from backend.app.api.v1.router import api_v1_router
from backend.app.db.session import async_engine, ping_database

setup_logging()
logger = logging.getLogger("epms.backend")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context for initialization and teardown."""
    logger.info(f"Starting {settings.APP_NAME} in [{settings.ENVIRONMENT}] mode...")
    logger.info(f"Allowed CORS origins: {settings.CORS_ORIGINS}")

    db_status = await ping_database()
    if db_status.get("status") == "connected":
        logger.info(
            f"Database connected successfully via {db_status.get('dialect')}+{db_status.get('driver')} (Latency: {db_status.get('latency_ms')}ms)"
        )
    else:
        logger.warning(
            f"Database connectivity check pending or offline: {db_status.get('error', 'Unknown')}"
        )

    yield

    logger.info("Shutting down database connection engine...")
    await async_engine.dispose()
    logger.info(f"{settings.APP_NAME} shutdown complete.")


def create_application() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        debug=settings.DEBUG,
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    @app.get("/", include_in_schema=False)
    async def root_info() -> JSONResponse:
        return JSONResponse({
            "service": settings.APP_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs": f"{settings.API_V1_PREFIX}/docs",
            "health": f"{settings.API_V1_PREFIX}/health",
        })

    return app


app = create_application()
