import json
import httpx
from fastapi import HTTPException
from app.core.config import load_config

config = load_config()


async def call_gemini(prompt: str, model: str = "gemini-2.5-flash") -> str:
    api_key = config["gemini_api_key"]
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json" if "json" in prompt.lower() else "text/plain"
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Extract text from Gemini response
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return text
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")


async def get_footprint_insights(breakdown: dict) -> list[str]:
    prompt = f"""
    Analyze this carbon footprint breakdown (kg CO2e per year): {json.dumps(breakdown)}.
    Provide the top 3 actionable reduction levers for this user.
    Return only a JSON array of strings.
    """
    response_text = await call_gemini(prompt)
    try:
        return json.loads(response_text)
    except:
        return [response_text]


async def get_weekly_plan(habits: list, footprint: dict) -> list[dict]:
    prompt = f"""
    Given the user's habits {json.dumps(habits)} and footprint {json.dumps(footprint)},
    generate a personalized 7-day eco-action plan.
    Each action should have: day (1-7), title, description, and estimated_co2_saved_kg.
    Return only a JSON array of objects.
    """
    response_text = await call_gemini(prompt)
    try:
        return json.loads(response_text)
    except:
        return []


async def analyze_biomass(lat: float, lng: float, district: str, aqi: int) -> dict:
    prompt = f"""
    Analyze biogas feasibility for a site at lat:{lat}, lng:{lng} in {district} district, Pakistan.
    Current AQI is {aqi}.
    Provide:
    - feasibility_score (1-10)
    - co2_saved_kg (estimated annual)
    - households_powered (estimated)
    - aqi_improvement_percent (if crop burning stopped)
    - tips (JSON array of 3 strings)
    Return only a JSON object.
    """
    response_text = await call_gemini(prompt)
    try:
        return json.loads(response_text)
    except:
        return {}
