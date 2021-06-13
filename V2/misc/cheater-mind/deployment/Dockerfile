FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
apt-get -y dist-upgrade && \
apt-get -y install supervisor socat python3

RUN useradd ctf

COPY supervisor.conf /etc/
RUN mkdir /opt/app
COPY secret.py challenge.py /opt/app/
EXPOSE 1337
CMD ["supervisord", "-c", "/etc/supervisor.conf"]
