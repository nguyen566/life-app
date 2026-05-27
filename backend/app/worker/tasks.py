from asgiref.sync import async_to_sync
from celery import Celery
from fastapi_mail import (
    ConnectionConfig,
    FastMail,
    MessageSchema,
    MessageType,
    NameEmail,
)
from pydantic import EmailStr

from app.utils import TEMPLATE_DIR
from ..config import db_settings, notification_settings

fast_mail = FastMail(
    ConnectionConfig(
        **notification_settings.model_dump(),
        TEMPLATE_FOLDER=TEMPLATE_DIR,
    ),
)

send_message = async_to_sync(fast_mail.send_message)

app = Celery(
    "api_tasks",
    broker=db_settings.REDIS_URL(9),
    backend=db_settings.REDIS_URL(9),
)


@app.task
def send_email_with_template(
    recipients: list[EmailStr],
    subject: str,
    context: dict,
    template_name: str,
):
    send_message(
        message=MessageSchema(
            recipients=[
                NameEmail(name=email.split("@")[0], email=email) for email in recipients
            ],
            subject=subject,
            subtype=MessageType.html,
            template_body=context,
        ),
        template_name=template_name,
    )
