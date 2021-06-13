FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y mariadb-server php apache2 php-mysql nodejs npm firefox

RUN rm /var/www/html/index.html

COPY original_store /var/www/html/
COPY entrypoint.sh /
COPY db.sql /opt/
RUN chmod +x /entrypoint.sh

COPY admin_bot /opt/admin_bot 
RUN cd /opt/admin_bot && npm install
RUN PUPPETEER_PRODUCT=firefox npm install puppeteer

EXPOSE 80

ENTRYPOINT ["bash", "/entrypoint.sh"]
