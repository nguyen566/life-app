from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

_base_config = SettingsConfigDict(
    env_file=BASE_DIR / ".env",
    env_file_encoding="utf-8",
    env_ignore_empty=True,
    extra="ignore",
)


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


db_settings = DatabaseSettings()  # type: ignore
notification_settings = NotificationSettings()  # type: ignore
security_settings = SecuritySettings()  # type: ignore
