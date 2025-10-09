#!/bin/sh
set -e

echo "=== Startup diagnostics ==="
echo "PWD: $(pwd)"
echo "PORT: ${PORT}"
echo "Listing /app:"
ls -la /app

echo "=== Python import test ==="
python - << 'PY'
import importlib, sys, os
print("Python", sys.version)
print("ENV PORT =", os.getenv("PORT"))
try:
    m = importlib.import_module("server")  # <-- change 'server' if your file is named differently
    print("Imported module 'server'")
    print("Has attr 'app' =", hasattr(m, "app"))
    if not hasattr(m, "app"):
        print("ERROR: 'server.py' does not define 'app'")
        sys.exit(1)
except Exception as e:
    print("IMPORT ERROR:", repr(e))
    sys.exit(1)
PY

echo "=== Launching Uvicorn ==="
exec uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1 --log-level debug
