# Project to demonstrate full-stack capabilities using Python fastapi as backend and ReactJS as frontend

## Table of Contents
* [Local Setup](#local-setup)
    * [Backend Setup](#backend-set-up)
    * [Frontend Setup](#frontend-setup)
    * [Docker Setup](#docker-setup)
* [Helpful Commands](#helpful-commands)
    * [Windows Terminal](#windows-terminal)
    * [Windows Ubuntu WSL](#windows-ubuntu-wsl)

## Getting Started

### Local Setup

> [!WARNING]
> **Disclaimer:** If you wish to test out this application, I highly recommend using docker. It will simplify the process because you will need to install dependencies. This readme will only show the way using docker

#### Backend set up

Create a `.env` file in the app/backend directory with the following values.
Fill this out accordingly

```bash
POSTGRES_SERVER='localhost'
POSTGRES_PORT=5432
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

REDIS_HOST=localhost
REDIS_PORT=6379

# Can use token_hex from secrets import, for now it's what we want
JWT_SECRET=secret
JWT_ALGORITHM=HS256

MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=
MAIL_FROM_NAME=
MAIL_SERVER=
MAIL_PORT=587
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

Go to the `docker-compose.yaml` file and make the changes according to the comments

#### Frontend Setup

Nothing to do here

#### Docker Setup

Using the terminal/powershell/WSL, navigate to the backend directory where `docker-compose.yaml` is located

Build the containers

```bash
docker compose up --build
```

Verify that containers are running. You can access the app in a browser now.

```bash
http://localhost:5173/
```

Tear down containers when done testing.

```bash
docker compose down
```

## Helpful Commands

### Windows Terminal
- **Runs the dev environment for backend**
    `fastapi dev`
- **Spins up virtual environment. Must be in project directory where venv file is located**
    `venv/Scripts/activate`
- **Outputs all installed dependencies and it's respective version into a file aka requirements.txt**
    `pip freeze > requirements.txt`
- **Creates an auto generated file for postgresql migrations**
    `alembic revision --autogenerate -m <message>`
- **Runs the upgrade command of the latest migration file for db changes**
    `alembic upgrade head`
- **Auto generates API Endpoints using openAPI**
    <!-- Ensure backend is running -->
    `sta generate -p http://127.0.0.1:8000/openapi.json -n client.ts --axios`
### Windows Ubuntu WSL <!-- Ensure you are in the project directory cd /mnt/<drive>/<project-directory> -->
- **Starts up redis server**
    `redis-server`
- **Stops redis-server if running in background. May need to append sudo for admin rights**
    `service redis-server stop`
- **Spins up virtual environment**
    `source .venv/bin/activate`
- **Connects celery to flower**
    `celery -A <task_worker_file> worker -E`
- **Initializes the flower desktop**
    `celery -A <task_worker_file> flower`