# Create Python Environment
FROM python:3.14
# Install nano to modify files
RUN apt update && apt install -y nano
# Set working directory -> root/app
WORKDIR /app
# Copy requirements first incase we want to edit any files
COPY requirements.txt .
# Install all python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Copy backend source code
COPY . .
