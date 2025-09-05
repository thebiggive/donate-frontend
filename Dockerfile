# Ensure updates are mirrored in `.circleci/config.yml`.
# Always specify a 3-part version, even if it's x.x.0.
FROM node:22.16.0
RUN node --version

WORKDIR /usr/src/app

# Do lib metadata copy + install separately, so this part of the build is cached when only app code changes.
# See https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package*.json ./

# Prepare FontAwesome config for `npm install`.
ARG FONTAWESOME_NPM_AUTH_TOKEN
COPY .npmrc ./

# Skip Puppeteer Chromium download. https://github.com/puppeteer/puppeteer/issues/2262#issuecomment-407405037
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

# Now copy the app source
COPY . .

# Take value 'regression', 'staging' or 'production' so we know which Angular vars to build into the app bundle.
# This controls e.g. which environment's API we target.
ARG BUILD_ENV

RUN npm run supportedBrowsers

# Build client bundle and prepare for Server-Side Rendering
RUN npm run build:${BUILD_ENV}

RUN sed -i "s/GIT_COMMIT_ID/$(git rev-parse --short HEAD)/" src/index.html

EXPOSE 4000

# Behave like a UK visitor when doing e.g. server-side rendering of Date Pipes.
ENV TZ='Europe/London'

# Serve with Server-Side Rendering support
CMD [ "npm", "run", "serve:ssr" ]
