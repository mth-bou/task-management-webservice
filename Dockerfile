FROM node:alpine

#RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

#WORKDIR /usr/src/node-app

WORKDIR /node-app

COPY package*.json ./

#USER node

RUN npm install

COPY src /node-app/src

CMD ["node", "./src/index.js"]
