FROM node:20-alpine

WORKDIR /usr/src/app

COPY api/package*.json ./

RUN npm install

COPY api/. .
COPY .env /usr/src/.env

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]