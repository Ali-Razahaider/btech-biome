from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.challenge import Challenge
from app.models.challenge_participant import ChallengeParticipant
from app.schemas.challenge import ChallengeRead, ChallengeParticipantRead

router = APIRouter()


@router.get("/", response_model=list[ChallengeRead])
async def list_challenges(
    db: AsyncSession = Depends(get_db_session),
):
    result = await db.execute(select(Challenge).where(Challenge.is_active == True))
    return result.scalars().all()


@router.post("/{challenge_id}/join", response_model=ChallengeParticipantRead)
async def join_challenge(
    challenge_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    
    # Check if already joined
    result = await db.execute(
        select(ChallengeParticipant).where(
            ChallengeParticipant.user_id == user_id,
            ChallengeParticipant.challenge_id == challenge_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already joined this challenge")

    participant = ChallengeParticipant(
        user_id=user_id,
        challenge_id=challenge_id
    )
    db.add(participant)
    await db.commit()
    await db.refresh(participant)
    return participant


@router.post("/{challenge_id}/leave")
async def leave_challenge(
    challenge_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(
        select(ChallengeParticipant).where(
            ChallengeParticipant.user_id == user_id,
            ChallengeParticipant.challenge_id == challenge_id
        )
    )
    participant = result.scalar_one_or_none()
    if not participant:
        raise HTTPException(status_code=404, detail="Not a participant of this challenge")

    await db.delete(participant)
    await db.commit()
    return {"message": "Left challenge successfully"}
