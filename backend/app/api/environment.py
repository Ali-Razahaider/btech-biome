import time
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.config import load_config

router = APIRouter()
config = load_config()

# Simple in-memory cache
# Key: city, Value: (timestamp, data)
_AQI_CACHE = {}
CACHE_TTL = 600 # 10 minutes


@router.get("/airquality")
async def get_environment_data(
    city: str = Query(..., description="City name (e.g., Lahore)"),
):
    now = time.time()
    if city in _AQI_CACHE:
        ts, data = _AQI_CACHE[city]
        if now - ts < CACHE_TTL:
            return data

    waqi_token = config["waqi_token"]
    if not waqi_token:
        raise HTTPException(status_code=500, detail="WAQI_TOKEN not configured")

    url = f"https://api.waqi.info/feed/{city}/?token={waqi_token}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") == "ok":
                _AQI_CACHE[city] = (now, data["data"])
                return data["data"]
            else:
                raise HTTPException(status_code=404, detail=f"AQI data not found for {city}")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Error fetching AQI data: {str(e)}")
