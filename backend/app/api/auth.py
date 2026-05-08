from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.user import UserRead, UserSync

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def read_me(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        # This shouldn't happen if they synced, but for safety:
        return {
            "id": user_id,
            "email": current_user.get("email"),
            "city": None,
            "habits": [],
            "eco_points": 0,
            "streak": 0,
            "created_at": None,
        }
    return user


@router.post("/sync", response_model=UserRead)
async def sync_user(
    user_data: UserSync,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=user_id,
            email=user_data.email,
            city=user_data.city,
            habits=user_data.habits,
        )
        db.add(user)
    else:
        user.email = user_data.email
        if user_data.city:
            user.city = user_data.city
        if user_data.habits:
            user.habits = user_data.habits

    await db.commit()
    await db.refresh(user)
    return user
