"""Serve the static review export with extensionless routes for local QA."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import urllib.parse

ROOT = Path(__file__).resolve().parents[1] / 'dist/client'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        route = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(route.path)
        if path != '/' and not (ROOT / path.lstrip('/')).is_file() and (ROOT / (path.lstrip('/') + '.html')).is_file():
            self.path = path + '.html' + (('?' + route.query) if route.query else '')
        super().do_GET()

    def log_message(self, *args):
        pass

print('EVA content review on http://127.0.0.1:4175', flush=True)
ThreadingHTTPServer(('0.0.0.0', 4175), Handler).serve_forever()
