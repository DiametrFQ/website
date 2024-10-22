from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)

@app.route('/')
def index():
    return 'Hello, world!'

@app.route('/health')
def health_check():
    return jsonify(status="OK"), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)