# Personal Project to demonstrate full-stack capabilities using Python fastapi as backend and ReactJS as frontend

## Table of Contents
* [Helpful Commands](#helpful-commands)
    * [Windows Terminal](#windows-terminal)
    * [Windows Ubuntu WSL](#windows-ubuntu-wsl)

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

### Windows Ubuntu WSL 
**Ensure you are in the project directory cd /mnt/<drive>/<project-directory>**
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