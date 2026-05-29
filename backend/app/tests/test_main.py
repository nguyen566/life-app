from httpx import AsyncClient
from app.tests.conftest import display_response, log_test_name


@log_test_name
async def test_app(client: AsyncClient):
    response = await client.get("/")
    display_response(response.json())
    assert response.status_code == 200
