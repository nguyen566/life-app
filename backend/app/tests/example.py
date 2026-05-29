from datetime import datetime, timezone
from uuid import UUID

from pwdlib import PasswordHash

from app.database.models import JobApplication, JobStatus, User
from sqlalchemy.ext.asyncio import AsyncSession

currentDate = datetime.now(timezone.utc)
password_context = PasswordHash.recommended()

user_id = UUID("7cfc8ba8-4a19-401c-9e78-730354e0f512")
job_id = UUID("7cfc8ba8-4a19-401c-9e78-730354e0f513")

USER = {
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "test@email.com",
    "dob": currentDate,
    "userName": "username",
    "phone": 1112223333,
    "password": "password",
}

JOB_APPLICATION = {
    "company": "company",
    "position": "position",
    "status": JobStatus.APPLIED,
    "site": "site",
}


async def create_test_data(session: AsyncSession):
    session.add(
        User(
            **USER,
            email_verified=True,
            password_hash=password_context.hash(str(USER["password"])),
            id=user_id,
        )
    )

    session.add(
        JobApplication(
            **JOB_APPLICATION,
            id=job_id,
            user_id=user_id,
            is_deleted=False,
        )
    )

    await session.commit()
