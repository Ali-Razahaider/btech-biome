from datetime import date, datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.eco_action import EcoAction
from app.models.user import User
from app.schemas.eco_action import EcoActionCreate, EcoActionRead

router = APIRouter()


@router.post("/", response_model=EcoActionRead)
@router.post("/log", response_model=EcoActionRead)
async def log_action(
    action_data: EcoActionCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    
    # 1. Create the action
    action = EcoAction(
        user_id=user_id,
        category=action_data.category,
        description=action_data.description,
        points=action_data.points,
    )
    db.add(action)

    # 2. Update user points and streak
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please sync first.")

    user.eco_points += action_data.points
    
    today = date.today()
    if user.last_active_date:
        if user.last_active_date == today:
            pass # Already active today, keep streak
        elif user.last_active_date == today - timedelta(days=1):
            user.streak += 1 # Active yesterday, increment streak
        else:
            user.streak = 1 # Missed days, reset streak
    else:
        user.streak = 1 # First action ever
        
    user.last_active_date = today

    await db.commit()
    await db.refresh(action)
    return action


@router.get("/", response_model=list[EcoActionRead])
@router.get("/recent", response_model=list[EcoActionRead])
async def get_actions(
    cursor: Optional[datetime] = Query(None, description="Cursor for pagination (ISO datetime string)"),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    
    stmt = (
        select(EcoAction)
        .where(EcoAction.user_id == user_id)
        .order_by(EcoAction.logged_at.desc())
        .limit(limit)
    )
    
    if cursor:
        stmt = stmt.where(EcoAction.logged_at < cursor)
        
    result = await db.execute(stmt)
    return result.scalars().all()
