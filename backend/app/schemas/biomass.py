from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class BiomassZoneRead(BaseModel):
    id: int
    district: str
    crop_type: str
    residue_tonnes_annual: float
    geojson: dict[str, Any]

    model_config = ConfigDict(from_attributes=True)


class AIAnalysisBase(BaseModel):
    lat: float
    lng: float
    district: str | None = None
    feasibility_score: int | None = None
    co2_saved_kg: float | None = None
    households_powered: int | None = None
    aqi_improvement_percent: float | None = None
    tips: list[str] = []


class AIAnalysisRead(AIAnalysisBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
