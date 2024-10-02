FROM node:20

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "prod" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]