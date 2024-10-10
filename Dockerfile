FROM node:alpine

# Create app directory
WORKDIR /urs/src/app

# Install app dependencies
COPY package*.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 9000
CMD ["npm", "start"]