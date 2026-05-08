from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ChallengeBase(BaseModel):
    title: str
    description: str
    points_reward: int
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool = True


class ChallengeRead(ChallengeBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChallengeParticipantRead(BaseModel):
    id: str
    user_id: str
    challenge_id: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)
