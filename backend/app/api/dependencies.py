from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import oauth2_scheme
from ..database.models import User
from ..database.redis import is_jti_blacklisted
from ..database.session import get_session
from ..services.job import JobApplicationService
from ..services.user import UserService
from ..utils import decode_access_token
from .schemas.user import UserResult

# Async database session dep annotation
SessionDep = Annotated[AsyncSession, Depends(get_session)]


# Access token data dep
async def get_access_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated"
        )

    decoded_token = decode_access_token(token)

    if not decoded_token or await is_jti_blacklisted(decoded_token["jti"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    return decoded_token


# Get Logged in User
async def get_logged_in_user(
    decoded_token: Annotated[dict, Depends(get_access_token)],
    session: SessionDep,
) -> UserResult:
    user = await session.get(User, UUID(decoded_token["user"]["id"]))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Unable to find user"
        )

    return UserResult(**user.model_dump())


def get_job_application_service(session: SessionDep):
    return JobApplicationService(session)


def get_user_service(session: SessionDep):
    return UserService(session)


CurrentUserDep = Annotated[User, Depends(get_logged_in_user)]
JobServiceDep = Annotated[JobApplicationService, Depends(get_job_application_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
