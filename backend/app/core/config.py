"""Application configuration settings"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    model_config = ConfigDict(env_file=".env", case_sensitive=True)

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TheHelpWorks Housing Engine"

    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19006",
    ]

    # Database Settings
    DATABASE_URL: str = "sqlite:///./housing_engine.db"

    # OpenAI Settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()
