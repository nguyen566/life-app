from pydantic import BaseModel, Field


class CommonHTTPResponse(BaseModel):
    detail: str = Field(description="Success message details")


class TokenValidationResponse(BaseModel):
    valid: bool = Field(description="Whether the token is valid")
