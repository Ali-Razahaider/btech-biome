from __future__ import annotations

from datetime import date, datetime
from typing import Any

from sqlalchemy import Date, DateTime, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    city: Mapped[str | None] = mapped_column(String(120))
    habits: Mapped[list[str]] = mapped_column(JSON, default=list)
    eco_points: Mapped[int] = mapped_column(Integer, default=0)
    streak: Mapped[int] = mapped_column(Integer, default=0)
    last_active_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    actions: Mapped[list["EcoAction"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    footprints: Mapped[list["FootprintLog"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    challenge_participations: Mapped[list["ChallengeParticipant"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
