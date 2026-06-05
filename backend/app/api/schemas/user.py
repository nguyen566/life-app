from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class BaseUser(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    dob: datetime


class UserResult(BaseUser):
    pass


class UserInput(BaseUser):
    password: str
    pass


class UserUpdate(BaseModel):
    dob: datetime | None = Field(default=None)
    password_hash: str | None = Field(default=None)
    email_verified: bool | None = Field(default=None)
