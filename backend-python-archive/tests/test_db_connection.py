import pytest
from httpx import AsyncClient

try:
    from backend.app.db.session import ping_database
except ImportError:
    from app.db.session import ping_database


@pytest.mark.asyncio
async def test_ping_database_utility():
    """Verify that ping_database returns structured status without uncaught exceptions."""
    result = await ping_database()
    assert isinstance(result, dict)
    assert "status" in result
    assert result["status"] in ["connected", "disconnected", "unexpected_result"]
    assert "latency_ms" in result
    assert isinstance(result["latency_ms"], (int, float))


@pytest.mark.asyncio
async def test_dedicated_db_health_endpoint(async_client: AsyncClient):
    """Verify that GET /api/v1/health/db returns 200 with raw connectivity metrics."""
    response = await async_client.get("/api/v1/health/db")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
    assert data["status"] in ["connected", "disconnected"]
