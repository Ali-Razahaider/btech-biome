from fastapi import Depends, FastAPI
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


@app.get("/")
def read_root():
    return {"message": "Hello, world"}
@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db_session)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok"}
