FROM node:16.20.0

WORKDIR /app

COPY ./package*.json ./

CMD [ "sh", "-c", "export CYPRESS_CACHE_FOLDER=/app/.cache && npm install && npm run serve:local" ]
