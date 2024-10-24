from flask import Flask

app = Flask(__name__)

# Маршрут для главной страницы
@app.route('/')
def home():
    return '<img src="https://media.giphy.com/media/3ohzdICpCk5DZCp4iC/giphy.gif" alt="Flask logo">'

# Маршрут для страницы данных
@app.route('/data')
def data():
    return 'This is some data!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000),