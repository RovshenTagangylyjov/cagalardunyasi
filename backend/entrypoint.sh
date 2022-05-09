#!/bin/bash

# Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

#exec "$@"
gunicorn cagalardunyasi.wsgi:application --bind 0.0.0.0:8000 --log-level debug --workers=4 --max-requests 100
