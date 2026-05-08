import time
from typing import Any

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

from app.core.config import load_config

bearer_scheme = HTTPBearer()
config = load_config()

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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase JWKS URL is not configured",
        )

    now = time.time()
    if _JWKS_CACHE["keys"] and now - _JWKS_CACHE["fetched_at"] < _JWKS_TTL_SECONDS:
        return _JWKS_CACHE["keys"]

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        data = response.json()

    keys = data.get("keys", [])
    _JWKS_CACHE["keys"] = keys
    _JWKS_CACHE["fetched_at"] = now
    return keys


async def verify_jwt(token: str) -> dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    jwks = await _fetch_jwks()
    key = next((k for k in jwks if k.get("kid") == header.get("kid")), None)
    if not key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown token key")

    try:
        return jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=config["supabase_jwt_audience"],
            issuer=config["supabase_jwt_issuer"],
        )
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token verification failed") from exc


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict[str, Any]:
    return await verify_jwt(credentials.credentials)
