FROM node:18

RUN mkdir -p /usr/src/bot/
WORKDIR /usr/src/bot/

COPY yarn.lock package.json /usr/src/bot/

RUN yarn install

COPY prisma /usr/src/bot/prisma/

COPY . /usr/src/bot/

RUN yarn prisma generate

RUN yarn build

CMD ["node", "./dist/index.js"]