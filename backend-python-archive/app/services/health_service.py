import platform
from datetime import datetime
from backend.app.core.config import settings
from backend.app.db.session import ping_database
from backend.app.schemas.health import HealthResponse, DatabaseHealthResponse


class HealthService:
    """Service to evaluate system health, dependencies, and database status."""

    @staticmethod
    async def get_system_health() -> HealthResponse:
        """Execute full health check including asynchronous database ping."""
        db_ping = await ping_database()

        db_health = DatabaseHealthResponse(
            status=db_ping.get("status", "disconnected"),
            latency_ms=db_ping.get("latency_ms"),
            dialect=db_ping.get("dialect"),
            driver=db_ping.get("driver"),
            error=db_ping.get("error"),
        )

        overall_status = "healthy" if db_health.status == "connected" else "degraded"

        return HealthResponse(
            status=overall_status,
            app_name=settings.APP_NAME,
            version=settings.VERSION,
            environment=settings.ENVIRONMENT,
            timestamp=datetime.utcnow(),
            database=db_health,
            system={
                "python_version": platform.python_version(),
                "platform": platform.platform(),
            },
        )
