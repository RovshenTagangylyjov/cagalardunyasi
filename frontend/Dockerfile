FROM node:18-alpine AS builder

COPY . frontend/
WORKDIR frontend

RUN yarn global add @quasar/cli
RUN yarn

RUN quasar build


FROM nginx:1.21.6-alpine

COPY --from=builder /frontend/dist/spa /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

