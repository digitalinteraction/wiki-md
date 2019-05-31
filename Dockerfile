# Use a node alpine image install packages and run the start script
FROM node:10-alpine
WORKDIR /app

RUN apk add --no-cache openssh-client

COPY ["package*.json", "/app/"]
ENV NODE_ENV production
RUN npm ci &> /dev/null

COPY src /app/src
RUN ln -s /app/src/cli.js /usr/local/bin/wiki-md
ENTRYPOINT [ "node", "src/cli.js", "../pages", "../dist" ]
