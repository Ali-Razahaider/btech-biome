from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import load_config
from app.api.auth import router as auth_router
from app.db.session import get_db_session

app = FastAPI()
config = load_config()
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


@app.get("/")
def read_root():
    return {"message": "Hello, world"}


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db_session)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok"}
