import os
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
    
    # Handle Render/Heroku style URLs (postgres -> postgresql+asyncpg)
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
    # SSL config for production (Render/Supabase)
    connect_args = {}
    if "render" in os.environ.get("HOSTNAME", "").lower() or os.environ.get("RENDER"):
        connect_args["ssl"] = True

    return create_async_engine(
        database_url, 
        pool_pre_ping=True,
        connect_args=connect_args if connect_args else {}
    )


engine = create_engine()
AsyncSessionLocal = async_sessionmaker(bind=engine, autoflush=False, autocommit=False)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
