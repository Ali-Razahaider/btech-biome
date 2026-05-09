from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import load_config
from app.db.session import get_db_session

from app.api.auth import router as auth_router
from app.api.footprint import router as footprint_router
from app.api.eco_actions import router as eco_actions_router
from app.api.challenges import router as challenges_router
from app.api.leaderboard import router as leaderboard_router
from app.api.environment import router as environment_router
from app.api.biomass import router as biomass_router
from app.api.ai import router as ai_router

app = FastAPI(title="Biome API")
config = load_config()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    # This ensures CORS headers are present even on internal errors
    response = JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__},
    )
    # Manually add CORS headers if the middleware didn't get to it
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

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
