import sys
from pathlib import Path
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport

root_dir = Path(__file__).resolve().parent.parent.parent
backend_dir = Path(__file__).resolve().parent.parent
for p in [str(root_dir), str(backend_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app.main import app
    from backend.app.core.config import settings
except ImportError:
    from app.main import app
    from app.core.config import settings


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """Asynchronous HTTP test client bound directly to the FastAPI app via ASGI transport."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
