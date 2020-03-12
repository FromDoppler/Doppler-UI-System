FROM node:10 as source
WORKDIR /work

RUN npm install -g gulp
COPY package-lock.json package.json ./
RUN npm install

COPY assets/ ./assets/
COPY gulpfile.js ./
COPY .editorconfig ./

#COPY ./node_modules ./
#RUN ./node_modules/.bin/eclint check **/*

RUN npm run prettier-check
RUN gulp dist
RUN chmod +777 -R --quiet ./dist/*
