from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

class TokenData(BaseModel):
    access_token: str
    token_type: str


