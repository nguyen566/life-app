from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from .config import security_settings
import jwt

_serializer = URLSafeTimedSerializer(security_settings.JWT_SECRET)

APP_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = APP_DIR / "templates"


def generate_access_token(data: dict, expiry: timedelta = timedelta(days=1)) -> str:
    return jwt.encode(
        payload={
            **data,
            "jti": uuid4().hex,
            "exp": datetime.now(timezone.utc) + expiry,
        },
        algorithm=security_settings.JWT_ALGORITHM,
        key=security_settings.JWT_SECRET,
    )


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            jwt=token,
            key=security_settings.JWT_SECRET,
            algorithms=[security_settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None


def generate_url_safe_token(data: dict) -> str:
    return _serializer.dumps(data)


def decode_url_safe_token(token: str, expiry: timedelta | None = None) -> dict | None:
    try:
        return _serializer.loads(
            token,
            max_age=int(expiry.total_seconds()) if expiry else None,
        )
    except (BadSignature, SignatureExpired):
        return None
