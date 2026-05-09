from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.core.config import load_config
from app.db.session import get_db_session
from app.db.init_db import init_db

from app.api.auth import router as auth_router
from app.api.footprint import router as footprint_router
from app.api.eco_actions import router as eco_actions_router
from app.api.challenges import router as challenges_router
from app.api.leaderboard import router as leaderboard_router
from app.api.environment import router as environment_router
from app.api.biomass import router as biomass_router
from app.api.ai import router as ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and Seed data
    try:
        await init_db()
    except Exception as e:
        print(f"Error during DB initialization: {e}")
    yield
    # Shutdown logic (if any) could go here

app = FastAPI(title="Biome API", lifespan=lifespan)
config = load_config()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://btech-biome-5v9c.vercel.app",
        "*" # Fallback
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(footprint_router, prefix="/api/footprint", tags=["footprint"])
app.include_router(eco_actions_router, prefix="/api/actions", tags=["actions"])
app.include_router(challenges_router, prefix="/api/challenges", tags=["challenges"])
app.include_router(leaderboard_router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(environment_router, prefix="/api/env", tags=["environment"])
app.include_router(biomass_router, prefix="/api/biomass", tags=["biomass"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception during {request.method} {request.url}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/api/db-test")
async def test_db_connection(db: AsyncSession = Depends(get_db_session)):
    try:
        from sqlalchemy import text
        await db.execute(text("SELECT 1"))
        return {"status": "connected", "database": "verified"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.get("/")
async def root():
    return {"message": "B-Tech Biome API is running"}

@app.get("/api/health")
async def health_check(db = Depends(get_db_session)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}
