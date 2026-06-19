from uuid import UUID

from fastapi import APIRouter, File, UploadFile

from app.database.models import JobApplication
from app.api.schemas.response import CommonHTTPResponse

from ..dependencies import CurrentUserDep, JobServiceDep, SecureTokenDep
from ..schemas import (
    JobApplicationCreate,
    JobApplicationResult,
    JobApplicationUpdate,
)

router = APIRouter(prefix="/jobs-applied", tags=["Jobs Applied"])


@router.get("/")
async def get_jobs_applied(
    _: CurrentUserDep, service: JobServiceDep
) -> list[JobApplicationResult]:
    jobs = await service.getAll()
    # Convert ORM models to response schemas
    return [JobApplicationResult(**job.model_dump()) for job in jobs]


@router.get("/{id}")
async def get_job_application(
    id: UUID, _: CurrentUserDep, service: JobServiceDep
) -> JobApplicationResult:
    job = await service.get(id)
    return JobApplicationResult(**job.model_dump())


@router.post("/")
async def create_job_application(
    user: CurrentUserDep,
    body: JobApplicationCreate,
    service: JobServiceDep,
) -> JobApplication:
    return await service.add(body, user)


@router.post("/upload")
async def upload_file(
    _: SecureTokenDep,
    user: CurrentUserDep,
    service: JobServiceDep,
    file: UploadFile = File(...),
) -> CommonHTTPResponse:
    return await service.mass_add(user, file)


@router.patch("/{id}")
async def update_job_application(
    id: UUID,
    job_application_update: JobApplicationUpdate,
    _: CurrentUserDep,
    service: JobServiceDep,
) -> JobApplicationResult:
    job_update = await service.update(id, job_application_update)

    return JobApplicationResult(**job_update.model_dump())


@router.delete("/{id}")
async def delete_job_application(
    _: CurrentUserDep, id: UUID, service: JobServiceDep
) -> bool:
    return await service.delete(id)

