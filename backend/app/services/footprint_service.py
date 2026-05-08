from app.schemas.footprint import FootprintCalculate


def calculate_co2e(data: FootprintCalculate) -> tuple[float, dict[str, float]]:
    transport_co2 = (data.transport_km_per_week * 52 * 0.12) + (data.flight_hours_per_year * 250)
    energy_co2 = data.monthly_kwh * 12 * 0.4
    food_co2 = data.meat_meals_per_week * 52 * 2.5

    total = transport_co2 + energy_co2 + food_co2
    breakdown = {
        "transport": round(transport_co2, 2),
        "energy": round(energy_co2, 2),
        "food": round(food_co2, 2),
    }

    return round(total, 2), breakdown
