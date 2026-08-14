#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r backend/requirements.txt
python backend/manage.py collectstatic --no-input
python backend/manage.py migrate
python backend/manage.py seed_data
python backend/fix_sequences.py
