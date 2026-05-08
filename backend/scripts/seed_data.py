import asyncio
import uuid
from datetime import date, timedelta
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.challenge import Challenge
from app.models.biomass_zone import BiomassZone


async def seed_challenges(db):
    challenges = [
        {
            "id": str(uuid.uuid4()),
            "title": "7 Days of Public Transport",
            "description": "Reduce your footprint by using buses or trains for all commutes this week.",
            "points_reward": 500,
            "is_active": True,
            "start_date": date.today(),
            "end_date": date.today() + timedelta(days=7),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Meat-Free Weekend",
            "description": "Switch to plant-based meals this Saturday and Sunday to save CO2.",
            "points_reward": 300,
            "is_active": True,
            "start_date": date.today(),
            "end_date": date.today() + timedelta(days=2),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Stubble Burning Awareness",
            "description": "Share educational content about biogas alternatives with 5 local farmers.",
            "points_reward": 1000,
            "is_active": True,
            "start_date": date.today(),
            "end_date": date.today() + timedelta(days=30),
        }
    ]

    for c in challenges:
        result = await db.execute(select(Challenge).where(Challenge.title == c["title"]))
        if not result.scalar_one_or_none():
            db.add(Challenge(**c))
            print(f"Seeded challenge: {c['title']}")


async def seed_biomass_zones(db):
    zones = [
        {
            "district": "Lahore",
            "crop_type": "Wheat/Rice",
            "residue_tonnes_annual": 1200.5,
            "geojson": {
                "type": "Feature",
                "properties": {"name": "Lahore Biomass Potential"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[74.2, 31.4], [74.5, 31.4], [74.5, 31.7], [74.2, 31.7], [74.2, 31.4]]]
                }
            }
        },
        {
            "district": "Sheikhupura",
            "crop_type": "Rice Stubble",
            "residue_tonnes_annual": 2500.0,
            "geojson": {
                "type": "Feature",
                "properties": {"name": "Sheikhupura High Potential"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[73.8, 31.6], [74.1, 31.6], [74.1, 31.9], [73.8, 31.9], [73.8, 31.6]]]
                }
            }
        },
        {
            "district": "Faisalabad",
            "crop_type": "Sugarcane Bagasse",
            "residue_tonnes_annual": 3200.0,
            "geojson": {
                "type": "Feature",
                "properties": {"name": "Faisalabad Energy Hub"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[72.9, 31.3], [73.2, 31.3], [73.2, 31.6], [72.9, 31.6], [72.9, 31.3]]]
                }
            }
        }
    ]

    for z in zones:
        result = await db.execute(select(BiomassZone).where(BiomassZone.district == z["district"]))
        if not result.scalar_one_or_none():
            db.add(BiomassZone(**z))
            print(f"Seeded biomass zone: {z['district']}")


async def main():
    async with AsyncSessionLocal() as db:
        await seed_challenges(db)
        await seed_biomass_zones(db)
        await db.commit()
        print("Seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())
