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

    async def send_email_with_template(
        self,
        recipients: list[EmailStr],
        subject: str,
        context: dict,
        template_name: str,
    ) -> dict:
        self.tasks.add_task(
            self.fastmail.send_message,
            message=MessageSchema(
                recipients=[
                    NameEmail(name=email.split("@")[0], email=email)
                    for email in recipients
                ],
                subject=subject,
                subtype=MessageType.html,
                template_body=context,
            ),
            template_name=template_name,
        )

        return {"detail": "Mail sent"}