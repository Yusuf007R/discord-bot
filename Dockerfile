FROM node:16

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg 

RUN wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl && chmod a+rx /usr/local/bin/youtube-dl

COPY package*.json ./

RUN npm install

COPY /src ./src

CMD [ "npm", "start" ]


