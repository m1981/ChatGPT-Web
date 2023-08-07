FROM node:18
WORKDIR /usr/src/app

# Install app dependencies to a directory that's not going to be overwritten by docker volume mount
RUN npm install typescript glob

# set an environment variable for node_modules
ENV NODE_PATH=/usr/src/app/node_modules

WORKDIR /app

CMD ["node", "gen-docs.js"]
