# Customised version of CircleCI Node image, published to Docker Hub as `thebiggive/donate-frontend-ci:latest` so it can be cached.
# This avoids CI runs having to install lots of packages on every build.

FROM circleci/node:12

# Dependencies for Chrome + Puppeteer. See https://medium.com/ramsatt/gitlab-ci-cd-with-angular-7-firebase-779bf040bb82
RUN sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
  libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
