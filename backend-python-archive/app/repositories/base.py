from typing import Generic, TypeVar, Type, Optional, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from backend.app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic async repository interface implementing foundational CRUD operations."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_by_id(self, session: AsyncSession, id: uuid.UUID) -> Optional[ModelType]:
        result = await session.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def get_all(
        self, session: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        result = await session.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(self, session: AsyncSession, obj_in: ModelType) -> ModelType:
        session.add(obj_in)
        await session.flush()
        await session.refresh(obj_in)
        return obj_in

    async def delete(self, session: AsyncSession, id: uuid.UUID) -> bool:
        result = await session.execute(delete(self.model).where(self.model.id == id))
        return result.rowcount > 0
