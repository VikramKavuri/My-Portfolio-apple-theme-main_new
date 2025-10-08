FROM python:3.11-slim
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
# copy backend code
COPY . .

# Cloud Run injects $PORT at runtime; use shell so it expands
ENV PORT=8080
CMD ["sh","-c","exec uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080} --log-level debug"]