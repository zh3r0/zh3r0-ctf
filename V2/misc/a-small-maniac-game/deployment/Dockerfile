FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_CTYPE=C.UTF-8
ENV TZ=Asia/Kolkata

RUN apt-get update 
RUN apt install -qq -y wget unzip python3-dev python3-pip apache2 libnss3 libgconf-2-4
RUN rm -rf /var/lib/apt/lists/*
# install google chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -qq -y update
RUN apt-get install -qq -y google-chrome-stable

# install chromedriver
RUN wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/91.0.4472.19/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/

# set display port to avoid crash
ENV DISPLAY=:99

# install selenium
RUN python3 -m pip install selenium==3.8.0
RUN rm /var/www/html/index.html
COPY files /var/www/html
RUN python3 -m pip install selenium flask gunicorn
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN mkdir /opt/app
COPY app.py /opt/app/
WORKDIR /opt/app/
EXPOSE 8000
RUN useradd -m ctf
ENV DISPLAY=:99
CMD ["bash", "-c", "/entrypoint.sh"]
