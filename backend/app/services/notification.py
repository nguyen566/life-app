from fastapi import BackgroundTasks
from fastapi_mail import (
    ConnectionConfig,
    FastMail,
    MessageSchema,
    MessageType,
    NameEmail,
)
from pydantic import EmailStr
from app.config import notification_settings
from app.utils import TEMPLATE_DIR


class NotificationService:
    def __init__(self, tasks: BackgroundTasks):
        self.fastmail = FastMail(
            ConnectionConfig(
                **notification_settings.model_dump(),
                TEMPLATE_FOLDER=TEMPLATE_DIR,
            ),
        )
        self.tasks = tasks

    def verify_email(self, recipients: list[EmailStr]) -> dict:
        self.tasks.add_task(
            self.fastmail.send_message,
            message=MessageSchema(
                recipients=[
                    NameEmail(name=email.split("@")[0], email=email)
                    for email in recipients
                ],
                subject="Verify your email",
                subtype=MessageType.html,
                template_body={"verify_url": "google.com"},
            ),
            template_name="mail_verify_email.html",
        )

        return {"detail": "Mail sent"}
