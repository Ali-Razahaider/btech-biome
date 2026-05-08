from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FootprintBase(BaseModel):
    total_co2e: float
    breakdown: dict[str, float]


class FootprintCalculate(BaseModel):
    # Transport (km driven per week, flight hours per year)
    transport_km_per_week: float
    flight_hours_per_year: float
    # Home energy (monthly kWh consumption)
    monthly_kwh: float
    # Food (meat meals per week)
    meat_meals_per_week: int


class FootprintRead(FootprintBase):
    id: str
    user_id: str
    logged_at: datetime

    model_config = ConfigDict(from_attributes=True)
