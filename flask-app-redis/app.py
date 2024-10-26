from flask import Flask, jsonify
from flask_caching import Cache
import os
import time

app = Flask(__name__)

# Настройка кэша (Redis как backend для кэша)
app.config['CACHE_TYPE'] = 'redis'
app.config['CACHE_REDIS_HOST'] = os.getenv('REDIS_HOST', 'localhost')
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0
app.config['CACHE_REDIS_URL'] = f"redis://{app.config['CACHE_REDIS_HOST']}:{app.config['CACHE_REDIS_PORT']}/0"

# Инициализация кэша
cache = Cache(app)

# Пример маршрута с кэшированием
@app.route('/data')
@cache.cached(timeout=60) # Данные будут кэшироваться на 60 секунд
def get_data():
    # Эмуляция долгого запроса (например, к базе данных)
    time.sleep(10)
    return jsonify({'data': 'This is some data!'})

@app.route('/user/<int:id>')
@cache.cached(timeout=120, key_prefix='user_data')
def get_user(id):
    # Здесь мог бы быть запрос к базе данных
    user_data = {'id': id, 'name': f'User {id}'}
    return jsonify(user_data)
    
# Очистка кэша для определенного пользователя
@app.route('/clear_cache/<int:id>')
def clear_user_cache(id):
    cache.delete(f'user_data::{id}')
    return jsonify({'message': f'Cache for user {id} cleared'})

if __name__ == '__main__':
    app.run(host='0.0.0.0')