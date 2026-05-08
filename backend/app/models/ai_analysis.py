from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, Integer, JSON, String, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    district: Mapped[str | None] = mapped_column(String(120))
    feasibility_score: Mapped[int | None] = mapped_column(Integer)
    co2_saved_kg: Mapped[float | None] = mapped_column(Float)
    households_powered: Mapped[int | None] = mapped_column(Integer)
    aqi_improvement_percent: Mapped[float | None] = mapped_column(Float)
    tips: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("feasibility_score >= 1 AND feasibility_score <= 10", name="feasibility_score_check"),
    )
