from datetime import datetime
from uuid import UUID

from app.database.models import JobStatus
from pydantic import BaseModel, Field


class BaseJobApplication(BaseModel):
    company: str = Field(description="Name of the company applied to")
    position: str = Field(description="Position applied for")
    site: str | None = Field(
        default=None, description="Job listing site (e.g., LinkedIn, Indeed)"
    )


class JobApplicationResult(BaseJobApplication):
    id: UUID = Field(
        description="Unique identifier for the job application",
    )
    status: JobStatus = Field(
        default=JobStatus.APPLIED, description="Current status of the job application"
    )
    date_applied: datetime = Field(
        default=datetime.now(), description="Date when the application was submitted"
    )
    date_modified: datetime = Field(
        default=datetime.now(), description="Date when the application was last updated"
    )
    user_id: UUID


class JobApplicationCreate(BaseJobApplication):
    date_applied: datetime = Field(
        default_factory=lambda: datetime.now(),
        description="Date when the application was submitted; defaults to current time if omitted",
    )
    status: JobStatus | None = Field(
        default=JobStatus.APPLIED,
        description="Current status of the job application; defaults to APPLIED if omitted",
    )


class JobApplicationUpdate(BaseModel):
    status: JobStatus | None = Field(
        default=None, description="Current status of the job application"
    )

