from functools import wraps
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.database.session import get_session
from app.main import app
from app.tests import example

engine = create_async_engine(url="sqlite+aiosqlite:///:memory:")
test_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)  # type: ignore


def log_test_name(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        print(f"\n--- Running Test: {func.__name__} ---")
        return await func(*args, **kwargs)

    return wrapper


def display_response(res):
    print(f"[Response]: {res}")


async def get_session_override():
    async with test_session() as session:
        yield session


@pytest_asyncio.fixture(scope="session")
async def client():
    async with AsyncClient(
        transport=ASGITransport(app),
        base_url="http://test",
    ) as client:
        yield client


@pytest_asyncio.fixture(scope="session")
async def user_token(client: AsyncClient):
    response = await client.post(
        "/user/login",
        data={
            "grant_type": "password",
            "username": example.USER["email"],
            "password": example.USER["password"],
        },
    )
    value = response.json()
    display_response(value)
    assert "access_token" in value
    return value["access_token"]


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_and_teardown():
    print("\nStarting tests...")

    app.dependency_overrides[get_session] = get_session_override

    async with engine.begin() as connection:
        from app.database.models import JobApplication, User  # noqa: F401

        await connection.run_sync(SQLModel.metadata.create_all)

    async with test_session() as session:
        await example.create_test_data(session)

    yield
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.drop_all)

    app.dependency_overrides.clear()

    print("\n...End of tests")
