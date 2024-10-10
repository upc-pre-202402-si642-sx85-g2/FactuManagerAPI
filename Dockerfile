FROM node:alpine
WORKDIR /urs/src/app
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]