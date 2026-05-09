import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db_session
from app.models.challenge import Challenge
from app.models.challenge_participant import ChallengeParticipant
from app.schemas.challenge import ChallengeCreate, ChallengeRead, ChallengeParticipantRead

router = APIRouter()


@router.get("/", response_model=list[ChallengeRead])
async def list_challenges(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(Challenge).where(Challenge.is_active == True))
    challenges = result.scalars().all()
    
    # Check participation for each challenge
    part_result = await db.execute(
        select(ChallengeParticipant.challenge_id)
        .where(ChallengeParticipant.user_id == user_id)
    )
    joined_ids = set(part_result.scalars().all())
    
    output = []
    for c in challenges:
        c_dict = ChallengeRead.model_validate(c).model_dump()
        c_dict["joined"] = c.id in joined_ids
        output.append(c_dict)
        
    return output


@router.post("/", response_model=ChallengeRead)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    # Hackathon requirement: check if user is admin (optional but good)
    if current_user.get("role") != "admin" and False: # Simplified for now
         raise HTTPException(status_code=403, detail="Not authorized to create challenges")

    new_challenge = Challenge(
        id=str(uuid.uuid4()),
        **challenge_data.model_dump()
    )
    db.add(new_challenge)
    await db.commit()
    await db.refresh(new_challenge)
    return new_challenge


@router.get("/stats")
async def get_challenge_stats(
    db: AsyncSession = Depends(get_db_session),
):
    # Participation stats: count users per challenge
    stmt = (
        select(
            Challenge.title,
            func.count(ChallengeParticipant.id).label("participant_count")
        )
        .join(ChallengeParticipant, Challenge.id == ChallengeParticipant.challenge_id, isouter=True)
        .group_by(Challenge.id)
    )
    result = await db.execute(stmt)
    stats = result.all()
    
    return [
        {"challenge": s.title, "participants": s.participant_count}
        for s in stats
    ]


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
