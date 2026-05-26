from fastapi import BackgroundTasks
from fastapi_mail import (
    ConnectionConfig,
    FastMail,
    MessageSchema,
    MessageType,
    NameEmail,
)
from pydantic import EmailStr
from app.config import app_settings, notification_settings
from app.utils import TEMPLATE_DIR
from ..database.models import User


class NotificationService:
    def __init__(self, tasks: BackgroundTasks):
        self.fastmail = FastMail(
            ConnectionConfig(
                **notification_settings.model_dump(),
                TEMPLATE_FOLDER=TEMPLATE_DIR,
            ),
        )
        self.tasks = tasks

    def verify_email(
        self,
        recipients: list[EmailStr],
        user: User,
        verify_token: str,
    ) -> dict:
        self.tasks.add_task(
            self.fastmail.send_message,
            message=MessageSchema(
                recipients=[
                    NameEmail(name=email.split("@")[0], email=email)
                    for email in recipients
                ],
                subject="Verify your email",
                subtype=MessageType.html,
                template_body={
                    "username": user.userName,
                    "verify_url": f"http://{app_settings.APP_DOMAIN}/user/verify?token={verify_token}",
                },
            ),
            template_name="mail_verify_email.html",
        )

        return {"detail": "Mail sent"}
