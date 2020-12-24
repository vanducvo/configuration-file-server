FROM node:15.5.0-alpine3.10

WORKDIR /configuration-server

COPY . .

RUN echo '' > .env.production
RUN yarn install
RUN mkdir /file-db

EXPOSE ${PORT}
CMD ["yarn", "start"]