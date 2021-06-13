#!/usr/bin/env bash

gunicorn -b 0.0.0.0:8080 -w 4 vuln_app.app:app
