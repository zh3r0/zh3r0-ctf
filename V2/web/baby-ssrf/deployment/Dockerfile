FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_CTYPE=C.UTF-8
ENV TZ=Asia/Kolkata

RUN apt update &&\
apt install -y python3 \
python3-pip \
php \
apache2 &&\
rm -rf /var/lib/apt/lists/*

RUN rm /var/www/html/index.html
COPY php_app/FLag_Dire/ /var/www/html/
COPY php_app/000-default.conf /etc/apache2/sites-available/
COPY php_app/ports.conf /etc/apache2/
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN mkdir /opt/app
COPY vuln_app/ /opt/app
WORKDIR /opt/app
RUN python3 -m pip install -r requirements.txt

EXPOSE 8080
RUN useradd -m ctf
CMD ["bash", "-c", "/entrypoint.sh"]

