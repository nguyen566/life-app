from fastapi import APIRouter

from .routers import job, user

master_router = APIRouter()

for route in [job.router, user.router]:
    master_router.include_router(route)