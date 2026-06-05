from datetime import datetime
from pydantic import EmailStr
from enum import Enum
from uuid import uuid4, UUID

from sqlmodel import Field, Relationship, SQLModel, Column, DateTime
from sqlalchemy.dialects import postgresql


class JobStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEWING = "Interviewing"
    REJECTED = "Rejected"
    ACCEPTED = "Accepted"


class JobApplication(SQLModel, table=True):
    __tablename__ = "job_applications"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        ),
    )
    company: str
    position: str
    site: str
    status: JobStatus = Field(default=JobStatus.APPLIED)
    date_applied: datetime = Field(default_factory=datetime.now)
    date_modified: datetime = Field(default_factory=datetime.now)
    is_deleted: bool = Field(default=False)

    user_email: EmailStr = Field(foreign_key="app_users.email")
    user: "User" = Relationship(
        back_populates="job_applications",
        sa_relationship_kwargs={
            "lazy": "selectin",
        },
    )


class User(SQLModel, table=True):
    __tablename__ = "app_users"

    email: EmailStr = Field(primary_key=True)
    firstName: str
    lastName: str
    dob: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    password_hash: str
    email_verified: bool = Field(default=False)

    job_applications: list[JobApplication] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "lazy": "selectin",
        },
    )
