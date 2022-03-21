# Create image based on the latest LTS (long term support) version
FROM node:17.6.0-alpine3.15

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production
RUN npm audit fix

# Bundle app source
COPY migrations/ ./migrations
COPY knexfile.ts ./
COPY dist/ ./dist
COPY loadEnv.js ./
COPY start.sh ./
RUN chmod +x ./start.sh

# Make sure we wait for depending services (defined under dockre-compose environment)
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
RUN /wait

CMD  /wait && ./start.sh