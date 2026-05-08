import os
from pathlib import Path
from typing import TypedDict


class ConfigDict(TypedDict):
    database_url: str
    supabase_url: str
    supabase_jwks_url: str
    supabase_jwt_issuer: str
    supabase_jwt_audience: str
    waqi_token: str
    gemini_api_key: str


def _load_dotenv_if_needed() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


def load_config() -> ConfigDict:
    """Load environment variables into a typed dict for static checking."""
    _load_dotenv_if_needed()
    supabase_url = os.getenv("SUPABASE_URL", "")
    supabase_jwt_issuer = os.getenv("SUPABASE_JWT_ISSUER", "")
    if not supabase_jwt_issuer and supabase_url:
        supabase_jwt_issuer = f"{supabase_url}/auth/v1"

    return {
        "database_url": os.getenv("DATABASE_URL", ""),
        "supabase_url": supabase_url,
        "supabase_jwks_url": os.getenv("SUPABASE_JWKS_URL", ""),
        "supabase_jwt_issuer": supabase_jwt_issuer,
        "supabase_jwt_audience": os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated"),
        "waqi_token": os.getenv("WAQI_TOKEN", ""),
        "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    }
