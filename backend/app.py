from flask import Flask, jsonify, send_file
import requests
import json
from datetime import datetime
import threading
import time
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_root = os.path.dirname(os.path.abspath(__file__))
_STATIC = os.path.join(_root, '..', 'frontend', 'dist')

logger.info('Root: %s', _root)
logger.info('Static folder: %s', _STATIC)
logger.info('index.html exists: %s', os.path.exists(os.path.join(_STATIC, 'index.html')))

app = Flask(__name__, static_folder=_STATIC, static_url_path=None)

BASE_URL = 'https://mbscada.com/hartek/server'
CREDENTIALS = {'clientId': 'HARTEK', 'username': 'userHartek', 'password': 'Hartek@123'}

cache = {
    'token': None, 'site': None, 'inverter': None,
    'mfm': None, 'performance': None, 'weather': None,
    'last_update': None, 'error': None,
}
lock = threading.Lock()


def login():
    try:
        r = requests.post(f'{BASE_URL}/api/auth/login', json=CREDENTIALS, timeout=30)
        if r.ok:
            cache['token'] = r.json()['token']
            return cache['token']
        logger.error(f'Login failed: {r.text[:100]}')
    except Exception as e:
        logger.error(f'Login error: {e}')
    return None


def api_get(path, timeout=30):
    token = cache.get('token')
    if not token:
        token = login()
    if not token:
        return None
    headers = {'Authorization': f'Bearer {token}', 'Origin': 'https://mbscada.com'}
    try:
        r = requests.get(f'{BASE_URL}{path}', headers=headers, timeout=timeout)
        if r.status_code == 401:
            token = login()
            if token:
                headers['Authorization'] = f'Bearer {token}'
                r = requests.get(f'{BASE_URL}{path}', headers=headers, timeout=timeout)
        return r.json() if r.ok else None
    except Exception as e:
        logger.error(f'GET {path} error: {e}')
        return None


def refresh_data():
    while True:
        try:
            token = login()
            if token:
                site = api_get('/api/site/')
                inverter = api_get('/api/inverter?siteId=HARTEK01')
                mfm = api_get('/api/mfm?siteId=HARTEK01')
                perf = api_get('/api/performance?siteId=HARTEK01')
                weather = api_get('/api/weather?siteId=HARTEK01')
                with lock:
                    if site: cache['site'] = site
                    if inverter: cache['inverter'] = inverter
                    if mfm: cache['mfm'] = mfm
                    if perf: cache['performance'] = perf
                    if weather: cache['weather'] = weather
                    cache['last_update'] = datetime.utcnow().isoformat()
                    cache['error'] = None
                logger.info('Data refreshed')
        except Exception as e:
            with lock:
                cache['error'] = str(e)
        time.sleep(30)


@app.route('/api/data')
def get_data():
    with lock:
        return jsonify({
            'site': cache.get('site'),
            'inverter': cache.get('inverter'),
            'mfm': cache.get('mfm'),
            'performance': cache.get('performance'),
            'weather': cache.get('weather'),
            'last_update': cache.get('last_update'),
            'error': cache.get('error'),
        })


@app.route('/api/refresh')
def force_refresh():
    token = login()
    if not token:
        return jsonify({'error': 'Login failed'}), 500
    for path, key in [('/api/site/', 'site'), ('/api/inverter?siteId=HARTEK01', 'inverter'),
                      ('/api/mfm?siteId=HARTEK01', 'mfm'), ('/api/performance?siteId=HARTEK01', 'performance'),
                      ('/api/weather?siteId=HARTEK01', 'weather')]:
        data = api_get(path)
        if data:
            with lock:
                cache[key] = data
    with lock:
        cache['last_update'] = datetime.utcnow().isoformat()
    return jsonify({'ok': True})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if not path:
        path = 'index.html'
    filepath = os.path.join(_STATIC, path)
    if os.path.exists(filepath) and os.path.isfile(filepath):
        return send_file(filepath)
    filepath = os.path.join(_STATIC, 'index.html')
    if os.path.exists(filepath):
        return send_file(filepath)
    logger.warning('Static file not found: %s', path)
    return 'Not Found', 404


os.makedirs(_STATIC, exist_ok=True)

logger.info('Starting background data refresher...')
t = threading.Thread(target=refresh_data, daemon=True)
t.start()
time.sleep(3)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
