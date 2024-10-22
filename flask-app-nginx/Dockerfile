# Базовый образ с Python
FROM python:3.9-alpine
# Устанавливаем рабочую директорию
WORKDIR /app
# Копируем файл зависимостей
COPY requirements.txt requirements.txt
# Устанавливаем зависимости
RUN pip install -r requirements.txt
# Копируем все файлы приложения
COPY . .
# Установка pytest для тестирования
EXPOSE 5000

RUN pip install pytest
# Команда для запуска приложения
CMD ["python", "app.py"]