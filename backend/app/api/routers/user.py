from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ...database.models import User

from ...database.redis import add_jti_to_blacklist
from ...utils import decode_access_token
from ...core.security import oauth2_scheme
from ..dependencies import SessionDep, UserServiceDep, get_access_token
from ..schemas import UserInput, UserResult

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/register")
async def register_user(user: UserInput, service: UserServiceDep) -> UserResult:
    new_user = await service.register(user)
    return UserResult(**new_user.model_dump())


@router.post("/login")
async def login_user(
    request_form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: UserServiceDep,
):
    user_token = await service.get_login_token(
        request_form.username, request_form.password
    )

    return {"access_token": user_token, "type": "jwt"}


@router.get("/logout")
async def logout_user(token_data: Annotated[dict, Depends(get_access_token)]):
    await add_jti_to_blacklist(token_data["jti"])
    return {"detail": "Successfully logged out"}
