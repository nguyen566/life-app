from datetime import timedelta
from uuid import UUID

from fastapi import BackgroundTasks, HTTPException, status
from pwdlib import PasswordHash
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import col

from ..config import app_settings
from ..api.schemas import UserInput
from ..database.models import User
from ..services.notification import NotificationService
from ..utils import (
    decode_url_safe_token,
    generate_access_token,
    generate_url_safe_token,
)

pwd_context = PasswordHash.recommended()


class UserService:
    def __init__(self, session: AsyncSession, tasks: BackgroundTasks):
        self.session = session
        self.notification_service = NotificationService(tasks)

    async def _get(self, id: UUID) -> User:
        user = await self.session.get(User, id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email does not exist",
            )

        return user

    async def _get_by_email(self, email: EmailStr) -> User:
        selectStmt = await self.session.execute(
            select(User).where(col(User.email) == email)
        )
        user = selectStmt.scalar()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email does not exist",
            )

        return user

    async def _create_user(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
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
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not a valid user credentials",
            )

        await self._create_user(new_user)
        await self._send_verify_notification(new_user)

        return new_user

    async def reset_user_password(self, token: str, new_password: str):
        token_data = decode_url_safe_token(
            token, salt="password-reset", expiry=timedelta(days=1)
        )

        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
            )

        user = await self._get(UUID(token_data["id"]))
        user.password_hash = pwd_context.hash(new_password)
        await self._update(user)

    async def verify_user_email(self, token: str):
        token_data = decode_url_safe_token(token)

        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
            )

        user = await self._get(UUID(token_data["id"]))
        user.email_verified = True
        await self._update(user)

    async def _send_verify_notification(self, user_data: User):
        selectStmt = await self.session.execute(
            select(User).where(col(User.email) == user_data.email)
        )

        result = selectStmt.scalar()

        if result:
            token = generate_url_safe_token({"id": str(result.id)})
            await self.notification_service.send_email_with_template(
                [result.email],
                "Verify your email",
                {
                    "username": result.userName,
                    "verify_url": f"http://{app_settings.APP_DOMAIN}/user/verify?token={token}",
                },
                "mail_verify_email.html",
            )

    async def get_login_token(self, email, password) -> str:
        # Validate credentials
        result = await self.session.execute(select(User).where(User.email == email))
        user_data = result.scalar()

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found",
            )

        if not pwd_context.verify(password, user_data.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password is incorrect",
            )

        if not user_data.email_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not verified",
            )

        token = generate_access_token(
            data={
                "user": {
                    "userName": user_data.userName,
                    "id": str(user_data.id),
                }
            }
        )

        return token

    async def send_password_reset_link(self, email: EmailStr):
        user = await self._get_by_email(email)

        token = generate_url_safe_token({"id": str(user.id)}, salt="password-reset")
        await self.notification_service.send_email_with_template(
            [user.email],
            "FastShip Account Password Reset",
            {
                "username": user.userName,
                "reset_url": f"http://{app_settings.APP_DOMAIN}/user/reset_password_form?token={token}",
            },
            "mail_password_reset.html",
        )
