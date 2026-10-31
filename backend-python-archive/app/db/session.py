import time
import logging
from typing import AsyncGenerator, Dict, Any
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
    AsyncEngine,
)
from sqlalchemy import text
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy 2.0 Asynchronous Engine
engine_kwargs: Dict[str, Any] = {
    "echo": settings.DB_ECHO,
    "future": True,
}

if "sqlite" not in settings.DATABASE_URL:
    engine_kwargs.update({
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "pool_timeout": settings.DB_POOL_TIMEOUT,
        "pool_recycle": settings.DB_POOL_RECYCLE,
        "pool_pre_ping": True,
    })

async_engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session rolled back due to error: {e}")
            raise
        finally:
            await session.close()


async def ping_database() -> Dict[str, Any]:
    """Verify actual database connectivity asynchronously using SELECT 1.
    
    Returns:
        Dict with status ('connected' | 'disconnected'), latency_ms, dialect, and driver.
    """
    start_time = time.perf_counter()
    try:
        async with async_engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            scalar = result.scalar()
            latency = (time.perf_counter() - start_time) * 1000

            if scalar == 1:
                return {
                    "status": "connected",
                    "latency_ms": round(latency, 2),
                    "dialect": async_engine.dialect.name,
                    "driver": async_engine.dialect.driver,
                }
            return {
                "status": "unexpected_result",
                "details": f"Expected scalar 1, received {scalar}",
            }
    except Exception as exc:
        latency = (time.perf_counter() - start_time) * 1000
        logger.warning(f"Database ping failed: {str(exc)}")
        return {
            "status": "disconnected",
            "latency_ms": round(latency, 2),
            "error": str(exc),
            "dialect": async_engine.dialect.name,
        }
