from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

_base_config = SettingsConfigDict(
    env_file=BASE_DIR / ".env",
    env_file_encoding="utf-8",
    env_ignore_empty=True,
    extra="ignore",
)


class AppSettings(BaseSettings):
    APP_NAME: str = "FastApi"
    APP_DOMAIN: str = "localhost:8000"


class DatabaseSettings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_URL: str

    REDIS_HOST: str
    REDIS_PORT: int

    model_config = _base_config

    # @property
    # def POSTGRES_URL(self):
    #     return f"postgresql+asyncpg://${self.POSTGRES_USER}:${self.POSTGRES_PASSWORD}@${self.POSTGRES_SERVER}:${self.POSTGRES_PORT}/${self.POSTGRES_DB}"

    def REDIS_URL(self, db):
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{db}"


class NotificationSettings(BaseSettings):
    model_config = _base_config

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool


class SecuritySettings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str

    model_config = _base_config


app_settings = AppSettings()
db_settings = DatabaseSettings()  # type: ignore
notification_settings = NotificationSettings()  # type: ignore
security_settings = SecuritySettings()  # type: ignore
