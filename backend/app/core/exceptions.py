from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse


class BaseCustomError(Exception):
    detail: str = "Base exception for all exceptions"
    status = status.HTTP_409_CONFLICT


class DuplicateUser(BaseCustomError):
    detail: str = "This email is already in use"
    status = status.HTTP_409_CONFLICT


class EntityNotFound(BaseCustomError):
    detail: str = "Entity(s) not found in database"
    status = status.HTTP_404_NOT_FOUND


class IncorrectPassword(BaseCustomError):
    detail: str = "Password is incorrect"
    status = status.HTTP_400_BAD_REQUEST


class InsufficientData(BaseCustomError):
    detail: str = "Insufficient data provided"
    status = status.HTTP_400_BAD_REQUEST

class InvalidFileType(BaseCustomError):
    detail: str = "Only CSV and XLSX files are supported"
    status = status.HTTP_400_BAD_REQUEST


class InvalidToken(BaseCustomError):
    detail: str = "Invalid or expired access token"
    status = status.HTTP_401_UNAUTHORIZED


class NotAuthenticatedUser(BaseCustomError):
    detail: str = "User is not authenticated"
    status = status.HTTP_401_UNAUTHORIZED


class NoFileFound(BaseCustomError):
    detail: str = "No file provided"
    status = status.HTTP_400_BAD_REQUEST

class UnverifiedEmail(BaseCustomError):
    detail: str = "Email is not verified"
    status = status.HTTP_401_UNAUTHORIZED


def _get_handler(status: int, detail: str):
    def handler(request: Request, exception: Exception) -> Response:
        raise HTTPException(
            status_code=status,
            detail=detail,
        )

    return handler


def add_exception_handlers(app: FastAPI):
    exception_classes = BaseCustomError.__subclasses__()

    for subclass in exception_classes:
        app.add_exception_handler(
            subclass, _get_handler(subclass.status, subclass.detail)
        )

    @app.exception_handler(status.HTTP_500_INTERNAL_SERVER_ERROR)
    def internal_server_error_handler(request, exception):
        return JSONResponse(
            content={"detail": "Something went wrong..."},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            headers={"X-Error": f"{exception}"},
        )
