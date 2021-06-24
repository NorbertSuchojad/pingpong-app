#!/bin/bash
exec gunicorn --log-config /app/gunicorn.conf --config /app/gunicorn_config.py app.wsgi:app

