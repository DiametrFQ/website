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

@app.route('/data')
@cache.cached(timeout=60) 
def get_data():
    time.sleep(10)
    return jsonify({'data': 'This is some data!'})

@app.route('/data2')
@cache.cached(timeout=60) 
def get_data():
    time.sleep(10)
    return jsonify({'data': 'This is some data2!'})

@app.route('/user/<int:id>')
@cache.cached(timeout=120, key_prefix='user_data')
def get_user(id):
    user_data = {'id': id, 'name': f'User {id}'}
    return jsonify(user_data)
    
@app.route('/clear_cache/<int:id>')
def clear_user_cache(id):
    cache.delete(f'user_data::{id}')
    return jsonify({'message': f'Cache for user {id} cleared'})

if __name__ == '__main__':
    app.run(host='0.0.0.0')