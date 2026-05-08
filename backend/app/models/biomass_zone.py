from __future__ import annotations

from typing import Any

from sqlalchemy import Float, JSON, String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BiomassZone(Base):
    __tablename__ = "biomass_zones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district: Mapped[str] = mapped_column(String(120), index=True)
    crop_type: Mapped[str] = mapped_column(String(80))
    residue_tonnes_annual: Mapped[float] = mapped_column(Float)
    geojson: Mapped[dict[str, Any]] = mapped_column(JSON)
