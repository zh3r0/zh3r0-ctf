FROM node
RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

#RUN useradd -d /home/pptruser/ -m -p ctf -s /bin/bash pptruser

WORKDIR /home/pptruser
RUN chown -R pptruser:pptruser ./
COPY package.json package.json
COPY package-lock.json package-lock.json
ENV DISPLAY=:0.0
ENV FLAG="zh3r0{this_is_a_flag_02b0482ec93d9f5688d5e0562fc2e2db}"
ENV PASSWORD="5r4dVRZ8?h9QxzPTA?nqd_g4@y5ar*"
ENV PROFILE="312f7ba59f70455259761d5c5eea7b1935565f08df08469b27cc96523744"
ENV SECRET="sb2bb283e7ednkendk3ndn3ldjojodjdohodh48fy"

COPY sessions ./sessions/
COPY *.js ./
COPY views ./views/
COPY package.json ./package.json

#WORKDIR /srv/node_modules/puppeteer/.local-chromium/linux-856583/chrome-linux/
#RUN chown root:root chrome_sandbox
#RUN chmod 4755 chrome_sandbox
# copy sandbox executable to a shared location
#RUN cp -p chrome_sandbox /usr/local/sbin/chrome-devel-sandbox
# export CHROME_DEVEL_SANDBOX env variable
#ENV CHROME_DEVEL_SANDBOX=/usr/local/sbin/chrome-devel-sandbox

RUN npm install 
RUN chown -R pptruser:pptruser ./
USER pptruser

EXPOSE 8080
CMD xvfb-run --server-args="-screen 0 1024x768x24" npm start
