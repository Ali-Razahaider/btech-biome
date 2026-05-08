from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.footprint_log import FootprintLog
from app.schemas.footprint import FootprintCalculate, FootprintRead
from app.services.footprint_service import calculate_co2e

router = APIRouter()


@router.post("/calculate", response_model=FootprintRead)
async def calculate_footprint(
    data: FootprintCalculate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    total_co2e, breakdown = calculate_co2e(data)

    log = FootprintLog(
        user_id=user_id,
        total_co2e=total_co2e,
        breakdown=breakdown,
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


@router.get("/history", response_model=list[FootprintRead])
async def get_footprint_history(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(
        select(FootprintLog)
        .where(FootprintLog.user_id == user_id)
        .order_by(FootprintLog.logged_at.desc())
    )
    return result.scalars().all()
