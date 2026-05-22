from typing import Any
from uuid import UUID

from fastapi import HTTPException, status

from app.database.models import JobStatus

from app.api.schemas import (
    JobApplicationCreate,
    JobApplicationUpdate,
)
from app.database.models import JobApplication, User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class JobApplicationService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, id: UUID) -> JobApplication:
        job_application = await self.session.get(JobApplication, id)

        if not job_application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Job application with id {id} not found.",
            )

        return job_application

    async def getAll(
        self,
    ) -> list[JobApplication]:
        getAllStmt = select(JobApplication)
        jobs = await self.session.execute(getAllStmt)
        validResult = list(jobs.scalars().all())
        all_jobs = [row for row in validResult if not row.is_deleted]

        if not all_jobs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No job applications found.",
            )

        return all_jobs

    async def add(
        self, job_application_create: JobApplicationCreate, user: User
    ) -> JobApplication:
        new_job = JobApplication(
            **job_application_create.model_dump(),
            status=JobStatus.APPLIED,
            is_deleted=False,
            user_id=user.id,
        )

        self.session.add(new_job)
        await self.session.commit()
        await self.session.refresh(new_job)

        return new_job

    async def update(
        self, id: UUID, job_application_update: JobApplicationUpdate
    ) -> JobApplication:
        update = job_application_update.model_dump(exclude_none=True)

        if not update:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided to update",
            )

        job_application = await self.get(id)

        if not job_application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No job application found to update",
            )

        job_application.sqlmodel_update(job_application_update)

        self.session.add(job_application)
        await self.session.commit()
        await self.session.refresh(job_application)
        return job_application

    async def delete(self, id: UUID) -> bool:
        delete: dict[str, Any] = {"is_deleted": True}
        job_application = await self.get(id)

        if not job_application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No job application found to delete",
            )

        job_application.sqlmodel_update(delete)

        self.session.add(job_application)
        await self.session.commit()
        await self.session.refresh(job_application)

        return True
