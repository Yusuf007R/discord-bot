FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN apk update && \
  apk add --no-cache --virtual .gyp build-base make g++ gcc wget && \
  apk add --no-cache python2 &&\
  npm install --only=production

FROM mhart/alpine-node:slim-16

COPY --from=0 /app /app

WORKDIR /app

RUN apk update && apk add --no-cache ffmpeg && \
  wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl &&\ 
  chmod a+rx /usr/local/bin/youtube-dl 

COPY /src ./src

CMD [ "node", "/app/src/index.js" ]


