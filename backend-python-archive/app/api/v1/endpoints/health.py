from fastapi import APIRouter, status
from backend.app.schemas.health import HealthResponse, DatabaseHealthResponse
from backend.app.services.health_service import HealthService
from backend.app.db.session import ping_database

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Application & Infrastructure Health Check",
    description="Returns the status of the EPMS backend, active configuration, and verifies database connectivity.",
)
async def check_health() -> HealthResponse:
    """Perform comprehensive health check verifying application and database state."""
    return await HealthService.get_system_health()


@router.get(
    "/health/db",
    response_model=DatabaseHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Dedicated Database Ping Check",
    description="Directly executes an asynchronous SELECT 1 query on the configured PostgreSQL engine.",
)
async def check_database_health() -> DatabaseHealthResponse:
    """Verify raw database connection latency and responsiveness."""
    result = await ping_database()
    return DatabaseHealthResponse(
        status=result.get("status", "disconnected"),
        latency_ms=result.get("latency_ms"),
        dialect=result.get("dialect"),
        driver=result.get("driver"),
        error=result.get("error"),
    )
