from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./promptvault.db"
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
if settings.JWT_SECRET_KEY == "change-me-in-production":
    raise RuntimeError(
        "Insecure default JWT_SECRET_KEY detected. Set the JWT_SECRET_KEY environment "
        "variable to a strong, random value before running the application in any "
        "networked or production environment. Example: export JWT_SECRET_KEY='your-strong-secret'"
    )