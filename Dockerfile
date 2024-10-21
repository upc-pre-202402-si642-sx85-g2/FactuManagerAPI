FROM node:16

# Instalar dependencias de compilación
RUN apt-get update && apt-get install -y \
    python \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /urs/src/app

# Install app dependencies
COPY package*.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 9000
CMD ["npm", "start"]