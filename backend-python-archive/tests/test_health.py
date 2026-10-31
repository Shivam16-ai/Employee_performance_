import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(async_client: AsyncClient):
    """Verify that GET /api/v1/health returns 200 with required structure."""
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
    assert data["status"] in ["healthy", "degraded"]
    assert "app_name" in data
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data
    assert "database" in data
    assert isinstance(data["database"], dict)
    assert "status" in data["database"]
    assert data["database"]["status"] in ["connected", "disconnected"]


@pytest.mark.asyncio
async def test_root_endpoint(async_client: AsyncClient):
    """Verify root endpoint returns operational metadata."""
    response = await async_client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "operational"
    assert "docs" in data
    assert "health" in data
