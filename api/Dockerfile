FROM node:14-buster

WORKDIR /usr/src/app

ARG PORT
ENV PORT ${PORT}

RUN apt-get update && apt-get install -y ffmpeg

COPY package.json yarn.lock* ./
RUN yarn && yarn cache clean

COPY . .

EXPOSE 7001

CMD ["npm", "start"]
