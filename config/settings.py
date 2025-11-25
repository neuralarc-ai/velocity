"""
Application Settings
Centralized configuration management using Pydantic
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    
    # Vector Database
    MEMORYDB_HOST: str = "localhost"
    MEMORYDB_PORT: int = 6379
    MEMORYDB_PASSWORD: str = ""
    MEMORYDB_SSL: bool = False
    MEMORYDB_DB: int = 0
    
    # AI Models
    VIDEO_MODEL: str = "ltx-video"
    VIDEO_MODEL_API_KEY: str = ""
    VIDEO_MODEL_ENDPOINT: str = ""
    
    ANALYSIS_MODEL: str = "clip"
    ANALYSIS_MODEL_API_KEY: Optional[str] = None
    
    # Attribution
    ATTRIBUTION_VARIANCE_THRESHOLD: float = 0.05
    MIN_CONFIDENCE_SCORE: float = 0.90
    MIN_SIMILARITY_THRESHOLD: float = 0.70
    
    # Safety
    CONTAMINATION_THRESHOLD: float = 0.05
    ENABLE_PRE_GEN_CHECK: bool = True
    ENABLE_POST_GEN_CHECK: bool = True
    
    # Performance
    MAX_EXECUTION_TIME: int = 60
    ENABLE_CACHING: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "data/logs/pipeline_logs/strand_ai.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

