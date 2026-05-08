from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.biomass_zone import BiomassZone
from app.schemas.biomass import BiomassZoneRead

router = APIRouter()


@router.get("/zones", response_model=list[BiomassZoneRead])
async def list_biomass_zones(
    db: AsyncSession = Depends(get_db_session),
):
    result = await db.execute(select(BiomassZone))
    return result.scalars().all()
