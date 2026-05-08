from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.models.footprint_log import FootprintLog
from app.models.ai_analysis import AIAnalysis
from app.schemas.biomass import AIAnalysisRead
from app.services import ai_service

router = APIRouter()


@router.post("/footprint-insights")
async def footprint_insights(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    user_id = current_user.get("sub")
    # Get latest footprint
    result = await db.execute(
        select(FootprintLog)
        .where(FootprintLog.user_id == user_id)
        .order_by(FootprintLog.logged_at.desc())
        .limit(1)
    )
    log = result.scalar_one_or_none()
    if not log:
        return {"insights": ["Please calculate your footprint first to get personalized insights."]}

    insights = await ai_service.get_footprint_insights(log.breakdown)
    return {"insights": insights}


@router.post("/weekly-plan")
async def weekly_plan(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    result = await db.execute(
        select(FootprintLog)
        .where(FootprintLog.user_id == user_id)
        .order_by(FootprintLog.logged_at.desc())
        .limit(1)
    )
    log = result.scalar_one_or_none()
    
    plan = await ai_service.get_weekly_plan(
        user.habits if user else [],
        log.breakdown if log else {}
    )
    return {"plan": plan}


@router.post("/biomass-analysis", response_model=AIAnalysisRead)
async def biomass_analysis(
    lat: float,
    lng: float,
    district: str,
    aqi: int,
    db: AsyncSession = Depends(get_db_session),
):
    data = await ai_service.analyze_biomass(lat, lng, district, aqi)
    
    analysis = AIAnalysis(
        lat=lat,
        lng=lng,
        district=district,
        feasibility_score=data.get("feasibility_score"),
        co2_saved_kg=data.get("co2_saved_kg"),
        households_powered=data.get("households_powered"),
        aqi_improvement_percent=data.get("aqi_improvement_percent"),
        tips=data.get("tips", []),
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    return analysis
