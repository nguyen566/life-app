from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class BaseUser(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    dob: datetime
    userName: str


class UserResult(BaseUser):
    id: UUID = Field(description="Unique identifier for a user")


class UserInput(BaseUser):
    password: str
    pass


class UserUpdate(BaseModel):
    email: str | None = Field(default=None)
    dob: datetime | None = Field(default=None)
    password_hash: str | None = Field(default=None)
