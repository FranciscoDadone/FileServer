FROM node:12

RUN mkdir -p /usr/src/app

WORKDIR /usr/scr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD [ "npm", "run", "start" ]