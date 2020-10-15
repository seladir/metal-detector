import redis
from flask import Flask
import detector

app = Flask(__name__)
redis = redis.Redis(host='redis', port=6379, db=0)


@app.route('/')
def hello_world():
    return 'Hello, World!'

