# Используем базовый образ Python
FROM python:3.9-alpine
# Устанавливаем рабочую директорию
WORKDIR /app
# Копируем файл зависимостей и устанавливаем их
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install redis Flask-Caching

# Копируем исходный код приложения
COPY . .
# Открываем порт 5000 для Flask
EXPOSE 5000
# Команда для запуска приложения
CMD ["python", "app.py"]