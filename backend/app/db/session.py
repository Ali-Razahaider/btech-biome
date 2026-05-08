from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import load_config

config = load_config()


def create_engine() -> AsyncEngine:
    database_url = config["database_url"]
    return create_async_engine(database_url, pool_pre_ping=True)


engine = create_engine()
AsyncSessionLocal = async_sessionmaker(bind=engine, autoflush=False, autocommit=False)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
