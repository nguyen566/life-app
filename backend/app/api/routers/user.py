from typing import Annotated

from fastapi import APIRouter, Depends, Form, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from pydantic import EmailStr

from app.utils import TEMPLATE_DIR
from app.core.security import TokenData
from app.api.schemas.response import CommonHTTPResponse

from ...config import app_settings
from ...database.redis import add_jti_to_blacklist
from ..dependencies import CurrentUserDep, UserServiceDep, get_access_token
from ..schemas import UserInput, UserResult

router = APIRouter(prefix="/user", tags=["User"])


# GETTERS
@router.get("/me")
async def get_current_profile(user: CurrentUserDep) -> UserResult:
    return user


@router.get("/forgot_password")
async def forgot_password(
    email: EmailStr, service: UserServiceDep
) -> CommonHTTPResponse:
    await service.send_password_reset_link(email)
    return CommonHTTPResponse(detail="Check email for password reset link")


@router.get("/logout")
async def logout_user(
    token_data: Annotated[dict, Depends(get_access_token)],
) -> CommonHTTPResponse:
    await add_jti_to_blacklist(token_data["jti"])
    return CommonHTTPResponse(detail="Successfully logged out")


# Rework this endpoint to return an HTML form for password reset instead of JSON response
@router.get("/reset_password_form")
async def reset_password_form(request: Request, token: str):
    templates = Jinja2Templates(TEMPLATE_DIR)

    return templates.TemplateResponse(
        request=request,
        name="reset_password_form.html",
        context={
            "reset_url": f"http://{app_settings.APP_DOMAIN}/user/reset_password?token={token}"
        },
    )


@router.get("/verify")
async def verify_user_email(token: str, service: UserServiceDep) -> CommonHTTPResponse:
    await service.verify_user_email(token)
    return CommonHTTPResponse(detail="Email verified successfully")


# POSTS
@router.post("/login")
async def login_user(
    request_form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: UserServiceDep,
) -> TokenData:
    user_token = await service.get_login_token(
        request_form.username, request_form.password
    )

    return TokenData(access_token=user_token, token_type="jwt")


@router.post("/register")
async def register_user(user: UserInput, service: UserServiceDep) -> UserResult:
    new_user = await service.register_user(user)
    return UserResult(**new_user.model_dump())


@router.post("/reset_password")
async def reset_password(
    token: str,
    password: Annotated[str, Form()],
    service: UserServiceDep,
) -> CommonHTTPResponse:
    await service.reset_user_password(token, password)
    return CommonHTTPResponse(detail="Password reset successful")
