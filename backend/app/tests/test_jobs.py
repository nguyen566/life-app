from httpx import AsyncClient
from app.tests import example
from app.tests.conftest import display_response, log_test_name
from app.database.models import JobStatus

base_url = "/jobs-applied/"


@log_test_name
async def test_job_auth(client: AsyncClient):
    response = await client.get(base_url)
    display_response(response.json())
    assert response.status_code == 401


@log_test_name
async def test_job_getAll(client: AsyncClient, user_token: str):
    response = await client.get(
        base_url,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    display_response(response.json())
    assert response.status_code == 200


@log_test_name
async def test_job_getOne(client: AsyncClient, user_token: str):
    response = await client.get(
        f"{base_url}{example.job_id}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    display_response(response.json())
    assert response.status_code == 200


@log_test_name
async def test_job_create(client: AsyncClient, user_token: str):
    response = await client.post(
        base_url,
        json=example.JOB_APPLICATION,
        headers={"Authorization": f"Bearer {user_token}"},
    )

    display_response(response.json())
    assert response.status_code == 200

    createdJob = await client.get(
        f"{base_url}{response.json()['id']}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert createdJob.status_code == 200


@log_test_name
async def test_job_update(client: AsyncClient, user_token: str):
    response = await client.patch(
        f"{base_url}{example.job_id}",
        json={"status": JobStatus.REJECTED},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200

    response = await client.get(
        f"{base_url}{response.json()['id']}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == JobStatus.REJECTED


@log_test_name
async def test_job_delete(client: AsyncClient, user_token: str):
    response = await client.get(
        base_url,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert len(response.json()) == 2

    response = await client.delete(
        f"{base_url}{example.job_id}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200

    response = await client.get(
        base_url,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
