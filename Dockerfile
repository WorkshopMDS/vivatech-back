FROM node:20-alpine as base

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base as production

RUN npm run build