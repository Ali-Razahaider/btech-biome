import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.user import Token, UserLogin, UserRead, UserRegister, UserSync

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db_session),
):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        city=user_data.city,
        habits=user_data.habits,
        role="user", # Hackathon requirement: include role in JWT
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate token
    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user,
    }


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db_session),
):
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=UserRead)
async def read_me(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        # Fallback for Supabase users who haven't set a password in our DB
        return {
            "id": user_id,
            "email": current_user.get("email"),
            "city": None,
            "habits": [],
            "eco_points": 0,
            "streak": 0,
            "created_at": None,
        }
    return user


@router.post("/sync", response_model=UserRead)
async def sync_user(
    user_data: UserSync,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=user_id,
            email=user_data.email,
            city=user_data.city,
            habits=user_data.habits,
        )
        db.add(user)
    else:
        user.email = user_data.email
        if user_data.city:
            user.city = user_data.city
        if user_data.habits:
            user.habits = user_data.habits

    await db.commit()
    await db.refresh(user)
    return user
