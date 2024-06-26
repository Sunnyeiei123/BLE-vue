FROM node:20

WORKDIR /usr/src/app/ble-frontend

COPY ./package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "serve" ]