import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Тест для проверки главной страницы
def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200 # Проверка, что код ответа 200 (OK)
    assert b'Welcome' in response.data # Проверка, что текст 'Welcome' присутствует на странице
    
# Тест для маршрута, возвращающего данные
def test_data_page(client):
    response = client.get('/data')
    assert response.status_code == 200
    assert b'This is some data!' in response.data # Проверка наличия кэшированных данных


def test_data_page(client):
    response = client.get('/data')
    assert response.status_code == 200
    assert b'This is some data!' in response.data

    
def test_cache(client):
    response1 = client.get('/data')
    response2 = client.get('/data')
    assert response1.data == response2.data # Данные должны быть одинаковыми из-за кэша


def test_404(client):
    response = client.get('/non_existent_route')
    assert response.status_code == 404
