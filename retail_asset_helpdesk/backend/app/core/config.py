from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "Retail Asset Helpdesk"
    PROJECT_DESCRIPTION: str = "AI-powered helpdesk for retail equipment troubleshooting"
    VERSION: str = "1.0.0"
    
    # API Settings
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000",
    ]
    
    # Qdrant
    QDRANT_HOST: str = "qdrant"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "retail_assets_docs"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Document Processing
    DOCS_FOLDER: str = "/app/docs"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Embedding
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()