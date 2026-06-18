import datetime
import io
from typing import Any
from uuid import UUID

import pandas as pd
from fastapi import File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import (
    JobApplicationCreate,
    JobApplicationUpdate,
)
from app.api.schemas.response import CommonHTTPResponse
from app.core.exceptions import (
    EntityNotFound,
    InsufficientData,
    InvalidFileType,
    NoFileFound,
)
from app.database.models import JobApplication, User


class JobApplicationService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, id: UUID) -> JobApplication:
        job_application = await self.session.get(JobApplication, id)
        if not job_application:
            raise EntityNotFound()

        return job_application

    async def getAll(
        self,
    ) -> list[JobApplication]:
        getAllStmt = select(JobApplication)
        jobs = await self.session.execute(getAllStmt)
        validResult = list(jobs.scalars().all())
        all_jobs = [row for row in validResult if not row.is_deleted]

        if not all_jobs:
            raise EntityNotFound()

        return all_jobs

    async def add(
        self, job_application_create: JobApplicationCreate, user: User
    ) -> JobApplication:
        new_job = JobApplication(
            **job_application_create.model_dump(),
            is_deleted=False,
            user_email=user.email,
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
            raise InsufficientData()

        job_application = await self.get(id)
        job_application.sqlmodel_update(job_application_update)

        self.session.add(job_application)
        await self.session.commit()
        await self.session.refresh(job_application)
        return job_application

    async def delete(self, id: UUID) -> bool:
        delete: dict[str, Any] = {"is_deleted": True}
        job_application = await self.get(id)
        job_application.sqlmodel_update(delete)

        self.session.add(job_application)
        await self.session.commit()
        await self.session.refresh(job_application)

        return True

    async def mass_add(
        self,
        user: User,
        file: UploadFile = File(...),
    ) -> CommonHTTPResponse:
        """Convenience wrapper that parses a file and then extracts the data.

        Delegates the heavy lifting to :meth:`extract_data`.
        """
        return await self.extract_data(user, file)

    async def parse_file(self, file: UploadFile = File(...)) -> pd.DataFrame:
        """Read a CSV or XLSX file into a ``pandas`` DataFrame.

        The method performs the same validation that was previously done in
        ``upload_file`` of the router.  It raises ``NoFileFound``, ``InvalidFileType`` and ``ParseFailure`` when appropriate.
        """

        # Validate that the request actually contains a file
        if not file.filename:
            raise NoFileFound()
        filename = file.filename.lower()
        allowed_extensions = {".csv", ".xlsx"}
        if not any(filename.endswith(ext) for ext in allowed_extensions):
            raise InvalidFileType()

        # Read the file into memory once
        contents = await file.read()
        try:
            if filename.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(contents))
            else:  # .xlsx or .xls
                df = pd.read_excel(io.BytesIO(contents))
        except Exception as exc:  # pragma: no cover – defensive
            raise HTTPException(detail=exc, status_code=status.HTTP_400_BAD_REQUEST)

        return df

    async def extract_data(self, user: User, file: UploadFile = File(...)):
        # Confirm it has the following columns: ['company', 'position', 'site', 'date_applied', 'status']
        df = await self.parse_file(file)

        required_columns = ["company", "position", "site", "date_applied", "status"]
        missing_cols = set(required_columns) - set(df.columns.tolist())
        if missing_cols:
            raise HTTPException(
                detail=f"Missing required columns: {', '.join(missing_cols)}",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Check for any missing data in the required columns
        if df[required_columns].isnull().any(axis=None):
            row_indexes = df.index[df[required_columns].isna().any(axis=1)]
            raise HTTPException(
                detail=f"Rows with index {row_indexes.tolist()} contain missing data",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Attempt to insert each entry into the database
        added_count = 0
        errors: list[str] = []
        for _, row in df.iterrows():
            try:
                # Convert date_applied into a UTC datetime and normalize to tz-naive
                try:
                    dt = pd.to_datetime(row["date_applied"], utc=True)
                    if hasattr(dt, "to_pydatetime"):
                        dt = dt.to_pydatetime()
                    if dt.tzinfo is not None:
                        dt = dt.replace(tzinfo=None)
                except Exception as e_date:
                    errors.append(
                        f"Invalid date format at row '{row.name}': {e_date}. Using today's UTC time."
                    )
                    dt = datetime.datetime.utcnow().replace(tzinfo=None)

                create_obj = JobApplicationCreate(
                    company=row["company"],
                    position=row["position"],
                    site=row["site"],
                    date_applied=dt,
                    status=row["status"],
                )
                await self.add(create_obj, user)
                added_count += 1
            except Exception as exc:  # pragma: no cover – defensive
                errors.append(str(exc))

        if errors:
            raise HTTPException(
                detail=f"Failed to add {len(errors)} records: {', '.join(errors[:3])}...",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return CommonHTTPResponse(
            detail=f"Successfully added {added_count} job applications."
        )

