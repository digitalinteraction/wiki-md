# Use a node alpine image install packages and run the start script
FROM node:10-alpine
WORKDIR /app

COPY ["package*.json", "/app/"]
ENV NODE_ENV production
RUN npm ci &> /dev/null

COPY src /app/src
ENTRYPOINT [ "node", "src/cli.js", "../pages", "../dist" ]
