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
    database_url = config.get("database_url")
    if not database_url:
        # Fallback for when env var is missing during build/startup
        database_url = "postgresql+asyncpg://user:pass@localhost/db"
    
    # Handle Render/Heroku style URLs (postgres -> postgresql+asyncpg)
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif database_url.startswith("postgresql://") and "+asyncpg" not in database_url:
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
    # SSL config for production (Render/Supabase)
    connect_args = {}
    
    # Render and Supabase often need SSL. 
    # If the URL contains sslmode=disable, we respect it.
    # Otherwise, if we're on Render, we try to use SSL.
    if "sslmode=disable" not in database_url:
        if os.environ.get("RENDER") or "render" in os.environ.get("HOSTNAME", "").lower():
            connect_args["ssl"] = "require" # asyncpg uses "require" or an SSLContext
        else:
            # For other environments like Supabase, "require" is also often needed
            connect_args["ssl"] = False # Default to False if not sure, but let URL handle it

    return create_async_engine(
        database_url, 
        pool_pre_ping=True,
        connect_args=connect_args
    )


engine = create_engine()
AsyncSessionLocal = async_sessionmaker(bind=engine, autoflush=False, autocommit=False)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
