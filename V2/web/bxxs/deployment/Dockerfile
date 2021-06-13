FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_CTYPE=C.UTF-8
ENV TZ=Asia/Kolkata

RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

RUN apt-get update && apt-get install -yq libgconf-2-4 gnupg

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    #&& apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

RUN apt update && \
apt install -y python3 \
python3-pip \
nodejs \
npm
RUN rm -rf /var/lib/apt/lists/*

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

WORKDIR /home/pptruser
RUN chown -R pptruser:pptruser ./
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN mkdir /home/pptruser/vuln_app
COPY vuln_app/* ./vuln_app/
RUN mkdir /home/pptruser/vuln_app/templates
COPY vuln_app/templates/* ./vuln_app/templates/
RUN chown -R pptruser:pptruser ./
RUN npm install puppeteer
WORKDIR /home/pptruser/vuln_app
RUN python3 -m pip install -r requirements.txt

COPY bot /home/pptruser/bot
WORKDIR /home/pptruser

EXPOSE 8080
RUN useradd -m ctf
RUN chown -R pptruser:pptruser ./
USER pptruser
CMD ["bash", "-c", "/entrypoint.sh"]

