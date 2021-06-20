#!/bin/sh
service apache2 start
su ctf -c 'gunicorn -b 0.0.0.0:8000 -w 4 app:app --timeout 360'
