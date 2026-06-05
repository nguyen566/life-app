from datetime import timedelta

from pwdlib import PasswordHash
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import col

from app.core.exceptions import (
    DuplicateUser,
    EntityNotFound,
    IncorrectPassword,
    InsufficientData,
    InvalidToken,
    UnverifiedEmail,
)

from ..api.schemas import UserInput
from ..config import app_settings
from ..database.models import User
from ..utils import (
    decode_url_safe_token,
    generate_access_token,
    generate_url_safe_token,
)
from ..worker.tasks import send_email_with_template

pwd_context = PasswordHash.recommended()


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _get(self, email: EmailStr) -> User:
        user = await self.session.get(User, email)

        if not user:
            raise EntityNotFound()

        return user

    async def _create_user(self, user: User) -> User:
        self.session.add(user)
        try:
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise DuplicateUser()
            
        await self.session.refresh(user)

        return user

    async def _update(self, user_update: User) -> User:
        return await self._create_user(user_update)

    async def register_user(self, user_input: UserInput) -> User:
        new_user = User(
            **user_input.model_dump(exclude={"password"}),
            password_hash=pwd_context.hash(user_input.password),
            job_applications=[],
        )

        if not new_user:
            raise InsufficientData()

        await self._create_user(new_user)
        await self._send_verify_notification(new_user)

        return new_user

    async def reset_user_password(self, token: str, new_password: str):
        token_data = decode_url_safe_token(
            token, salt="password-reset", expiry=timedelta(days=1)
        )

        if not token_data:
            raise InvalidToken()

        user = await self._get(token_data["email"])
        user.password_hash = pwd_context.hash(new_password)
        await self._update(user)

    async def verify_user_email(self, token: str):
        token_data = decode_url_safe_token(token)

        if not token_data:
            raise InvalidToken()

        user = await self._get(token_data["email"])
        user.email_verified = True
        await self._update(user)

    async def _send_verify_notification(self, user_data: User):
        selectStmt = await self.session.execute(
            select(User).where(col(User.email) == user_data.email)
        )

        result = selectStmt.scalar()

        if result:
            token = generate_url_safe_token({"email": str(result.email)})
            send_email_with_template.delay(
                [result.email],
                "Verify your email",
                {
                    "email": result.email,
                    # "verify_url": f"http://{app_settings.WEB_APP_DOMAIN}/user/verify?token={token}",
                    "verify_url": f"http://{app_settings.WEB_APP_DOMAIN}/verify?token={token}",
                },
                "mail_verify_email.html",
            )

    async def get_login_token(self, email, password) -> str:
        # Validate credentials
        result = await self.session.execute(select(User).where(User.email == email))
        user_data = result.scalar()

        if not user_data:
            raise EntityNotFound()

        if not pwd_context.verify(password, user_data.password_hash):
            raise IncorrectPassword()

        if not user_data.email_verified:
            raise UnverifiedEmail()

        token = generate_access_token(
            data={
                "user": {
                    "email": user_data.email,
                }
            }
        )

        return token

    async def send_password_reset_link(self, email: EmailStr):
        token = generate_url_safe_token({"email": str(email)}, salt="password-reset")
        send_email_with_template.delay(
            [email],
            "Job Tracker Account Password Reset",
            {
                "email": email,
                "reset_url": f"http://{app_settings.APP_DOMAIN}/user/reset_password_form?token={token}",
            },
            "mail_password_reset.html",
        )
