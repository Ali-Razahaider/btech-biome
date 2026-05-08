from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    user_id: str
    email: str
    eco_points: int
    rank: int
    streak: int
    city: str | None = None
