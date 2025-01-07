FROM node:lts-alpine

RUN mkdir -p /opt/fua
WORKDIR /opt/fua

ENV NODE_ENV="production"
RUN npm install @fua/app.logger

ENV PATH="$PATH:/opt/fua/node_modules/.bin"
EXPOSE 3000

HEALTHCHECK CMD fua.app.logger.healthcheck
ENTRYPOINT fua.app.logger