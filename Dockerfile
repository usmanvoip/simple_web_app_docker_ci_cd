FROM node:14.15.1-alpine

WORKDIR /var/app

ADD . .

RUN yarn install --only=prod

ENV PORT 3000 
ENV NODE_ENV production
#ENV DBHOST mongodb://docker.mongodb:27017/test

EXPOSE 3000 

CMD ["yarn", "start"]
