from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
# Конфигурация для подключения к базе данных PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/flask_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Инициализация SQLAlchemy
db = SQLAlchemy(app)

migrate = Migrate(app, db) # Инициализация Flask-Migrate


# Пример модели для таблицы "User"
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    def __repr__(self):
        return f'<User {self.username}>'
if __name__ == '__main__':
    app.run(host='0.0.0.0')


# Создание нового пользователя
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'})

# Получение всех пользователей
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return jsonify(users_list)
# Обновление пользователя
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    data = request.get_json()
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

# Удаление пользователя
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0')