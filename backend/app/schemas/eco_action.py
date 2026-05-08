from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EcoActionBase(BaseModel):
    category: str
    description: str
    points: int


class EcoActionCreate(BaseModel):
    category: str
    description: str
    points: int


class EcoActionRead(EcoActionBase):
    id: str
    user_id: str
    logged_at: datetime

    model_config = ConfigDict(from_attributes=True)
