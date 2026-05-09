import time
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import load_config

bearer_scheme = HTTPBearer()
config = load_config()

# Hackathon Requirement: Bcrypt (cost factor 12)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = config["jwt_secret_key"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


_JWKS_CACHE: dict[str, Any] = {
    "keys": [],
    "fetched_at": 0.0,
}
_JWKS_TTL_SECONDS = 3600


def _resolve_jwks_url() -> str:
    if config["supabase_jwks_url"]:
        return config["supabase_jwks_url"]
    if config["supabase_url"]:
        return f"{config['supabase_url']}/auth/v1/keys"
    return ""


async def _fetch_jwks() -> list[dict[str, Any]]:
    jwks_url = _resolve_jwks_url()
    if not jwks_url:
        return []

    now = time.time()
    if _JWKS_CACHE["keys"] and now - _JWKS_CACHE["fetched_at"] < _JWKS_TTL_SECONDS:
        return _JWKS_CACHE["keys"]

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            headers = {}
            if config["supabase_anon_key"]:
                headers["apikey"] = config["supabase_anon_key"]
            
            response = await client.get(jwks_url, headers=headers)
            response.raise_for_status()
            data = response.json()
            keys = data.get("keys", [])
            _JWKS_CACHE["keys"] = keys
            _JWKS_CACHE["fetched_at"] = now
            return keys
        except:
            return []


async def verify_jwt(token: str) -> dict[str, Any]:
    # Try custom JWT first (HS256)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        pass

    # Fallback to Supabase JWT (RS256)
    try:
        header = jwt.get_unverified_header(token)
        jwks = await _fetch_jwks()
        key = next((k for k in jwks if k.get("kid") == header.get("kid")), None)
        if key:
            return jwt.decode(
                token,
                key,
                algorithms=["RS256", "ES256"],
                audience=config["supabase_jwt_audience"],
                issuer=config["supabase_jwt_issuer"],
            )
    except Exception:
        pass
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict[str, Any]:
    return await verify_jwt(credentials.credentials)
