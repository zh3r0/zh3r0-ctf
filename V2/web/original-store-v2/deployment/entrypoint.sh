#!/usr/bin/env bash

echo "Starting Services"

service mysql start
service apache2 start

echo "Done!"
echo "Sleeping for 2 sec to let the services boot"
sleep 2 
echo "Done!"

echo "Creating database user and schema"

mysql -uroot -e 'create schema original_shop; create user "dbuser"@"localhost" identified by "hia6koocie9Eahoi"; GRANT all privileges on original_shop.* to "dbuser"@"localhost"; FLUSH privileges;'

echo "Done!"

echo "Populating database"

mysql -udbuser -phia6koocie9Eahoi original_shop < /opt/db.sql

echo "Done!"

export DISPLAY=:0.0
firefox --headless &
export PUPPETEER_EXECUTABLE_PATH='/usr/bin/firefox'
cd /opt/admin_bot
node server.js
