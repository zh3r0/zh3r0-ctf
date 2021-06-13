#!/usr/bin/env bash

service apache2 start
su ctf -c 'gunicorn -b 0.0.0.0:8080 -w 4 app:app'
