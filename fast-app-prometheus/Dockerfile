FROM python:3.9-slim

# Установка зависимостей
RUN pip install --no-cache-dir flask prometheus_flask_exporter

# Копирование приложения
WORKDIR /app
COPY . /app

# Запуск приложения
CMD ["python", "app.py"]
