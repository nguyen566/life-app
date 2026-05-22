from fastapi import HTTPException, status
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..utils import generate_access_token

from ..api.schemas import UserInput
from ..database.models import User

pwd_context = PasswordHash.recommended()


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, id: int) -> User | None:
        return await self.session.get(User, id)

    async def register(self, user_input: UserInput) -> User:
        new_user = User(
            **user_input.model_dump(exclude={"password"}),
            password_hash=pwd_context.hash(user_input.password),
            job_applications=[]
        )

        if not new_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not a valid user credentials",
            )

        self.session.add(new_user)
        await self.session.commit()
        await self.session.refresh(new_user)

        return new_user

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
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Password is incorrect",
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
