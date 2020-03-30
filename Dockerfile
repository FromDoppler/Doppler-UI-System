FROM node:10.13.0 as source
WORKDIR /work

RUN npm install -g gulp
COPY package-lock.json package.json ./
RUN npm install

COPY assets/ ./assets/
COPY gulpfile.js ./
COPY .editorconfig ./
