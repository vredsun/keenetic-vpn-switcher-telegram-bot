FROM docker.io/library/node:22-alpine

RUN mkdir -p /app

COPY ./ ./app

WORKDIR ./app

RUN npm ci

EXPOSE ${PORT}

CMD ["npm", "run", "start"]