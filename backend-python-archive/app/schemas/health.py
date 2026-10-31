from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class DatabaseHealthResponse(BaseModel):
    status: str = Field(description="Database connectivity status: 'connected' or 'disconnected'")
    latency_ms: Optional[float] = Field(None, description="Roundtrip query latency in milliseconds")
    dialect: Optional[str] = Field(None, description="Database dialect (e.g. postgresql)")
    driver: Optional[str] = Field(None, description="Database driver (e.g. asyncpg)")
    error: Optional[str] = Field(None, description="Error message if disconnected")


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Application status: 'healthy' or 'degraded'")
    app_name: str = Field(..., description="Application name")
    version: str = Field(..., description="Application release version")
    environment: str = Field(..., description="Operating environment: development, staging, production")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of response")
    database: DatabaseHealthResponse = Field(..., description="Real-time database connectivity check")
    system: Dict[str, Any] = Field(default_factory=dict, description="System metadata")
