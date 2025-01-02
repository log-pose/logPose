FROM node:20-bullseye
WORKDIR /api/
COPY package*.json ./
COPY . .
RUN npm run build
EXPOSE 3000