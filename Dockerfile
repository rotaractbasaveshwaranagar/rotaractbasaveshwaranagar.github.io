FROM node:13.10.1-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 
RUN npm dedupe && npm prune && npm shrinkwrap

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]