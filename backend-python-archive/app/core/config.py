import json
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )

    # Application
    APP_NAME: str = "EPMS Enterprise Backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    VERSION: str = "1.0.0"

    # Server (Port 8001 avoids conflict with system control plane)
    HOST: str = "0.0.0.0"
    PORT: int = 8001

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8001",
        "https://ais-dev-gsrdzjekintatdskhhhwlo-648052496423.asia-southeast1.run.app",
        "https://ais-pre-gsrdzjekintatdskhhhwlo-648052496423.asia-southeast1.run.app"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

    # PostgreSQL Database Credentials
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "epms_user"
    POSTGRES_PASSWORD: str = "epms_secure_password"
    POSTGRES_DB: str = "epms_db"

    # Full Database URLs
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://epms_user:epms_secure_password@localhost:5432/epms_db"
    )
    SYNC_DATABASE_URL: str = Field(
        default="postgresql+psycopg2://epms_user:epms_secure_password@localhost:5432/epms_db"
    )

    # Database Connection Pool Settings
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800
    DB_ECHO: bool = False

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "text"


settings = Settings()
