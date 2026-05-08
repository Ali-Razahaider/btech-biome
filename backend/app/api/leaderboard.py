from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.db.session import get_db_session
from app.models.user import User
from app.models.eco_action import EcoAction
from app.schemas.leaderboard import LeaderboardEntry

router = APIRouter()


@router.get("/", response_model=list[LeaderboardEntry])
@router.get("/global", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    filter: str = Query("alltime", enum=["alltime", "weekly", "monthly"]),
    db: AsyncSession = Depends(get_db_session),
):
    if filter == "alltime":
        result = await db.execute(
            select(User)
            .order_by(desc(User.eco_points))
            .limit(50)
        )
        users = result.scalars().all()
        return [
            LeaderboardEntry(
                user_id=u.id,
                email=u.email,
                eco_points=u.eco_points,
                rank=i + 1,
                streak=u.streak,
                city=u.city
            )
            for i, u in enumerate(users)
        ]
    else:
        # Time-based filter
        days = 7 if filter == "weekly" else 30
        since = datetime.now() - timedelta(days=days)
        
        # Aggregate points from EcoAction logs
        stmt = (
            select(
                User.id,
                User.email,
                func.sum(EcoAction.points).label("period_points"),
                User.streak,
                User.city
            )
            .join(EcoAction, User.id == EcoAction.user_id)
            .where(EcoAction.logged_at >= since)
            .group_by(User.id)
            .order_by(desc("period_points"))
            .limit(50)
        )
        
        result = await db.execute(stmt)
        rows = result.all()
        
        return [
            LeaderboardEntry(
                user_id=row.id,
                email=row.email,
                eco_points=row.period_points,
                rank=i + 1,
                streak=row.streak,
                city=row.city
            )
            for i, row in enumerate(rows)
        ]
