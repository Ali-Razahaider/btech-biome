import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.challenge import Challenge
from app.models.eco_action import EcoAction
from app.models.biomass_zone import BiomassZone
from app.models.footprint_log import FootprintLog
from app.models.ai_analysis import AIAnalysis

from scripts.seed_data import seed_challenges, seed_biomass_zones

logger = logging.getLogger(__name__)

async def init_db():
    async with engine.begin() as conn:
        # This will create tables if they don't exist
        # In production with Alembic, this is usually redundant but safe for hackathons
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSession(engine) as db:
        # Check if we need to seed
        result = await db.execute(select(BiomassZone).limit(1))
        if not result.scalar_one_or_none():
            logger.info("Database empty, seeding data...")
            await seed_challenges(db)
            await seed_biomass_zones(db)
            await db.commit()
            logger.info("Seeding completed.")
        else:
            logger.info("Database already has data, skipping seed.")
