FROM node:20 as base


FROM base as dev

WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]


FROM base as prod

WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]