from pydantic import BaseModel, Field


class CommonHTTPResponse(BaseModel):
    detail: str = Field(description="Success message details")
