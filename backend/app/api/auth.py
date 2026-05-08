from fastapi import APIRouter, Depends

from app.core.security import get_current_user

router = APIRouter()


@router.get("/me")
async def read_me(user: dict = Depends(get_current_user)):
    return {
        "id": user.get("sub"),
        "email": user.get("email"),
        "role": user.get("role"),
        "aud": user.get("aud"),
        "iss": user.get("iss"),
    }
