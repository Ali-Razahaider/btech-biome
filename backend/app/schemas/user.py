from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    city: str | None = None
    habits: list[str] = []


class UserSync(UserBase):
    pass


class UserRead(UserBase):
    id: str
    eco_points: int
    streak: int
    last_active_date: date | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    city: str | None = None
    habits: list[str] | None = None
