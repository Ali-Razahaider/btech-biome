import os
from typing import TypedDict


class ConfigDict(TypedDict):
    database_url: str
    supabase_url: str
    supabase_jwks_url: str
    waqi_token: str
    gemini_api_key: str


def load_config() -> ConfigDict:
    """Load environment variables into a typed dict for static checking."""
    return {
        "database_url": os.getenv("DATABASE_URL", ""),
        "supabase_url": os.getenv("SUPABASE_URL", ""),
        "supabase_jwks_url": os.getenv("SUPABASE_JWKS_URL", ""),
        "waqi_token": os.getenv("WAQI_TOKEN", ""),
        "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    }
