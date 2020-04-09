FROM node:10.18.1 as source
WORKDIR /work

RUN npm install -g gulp
COPY package-lock.json package.json ./
RUN npm install

COPY assets/ ./assets/
COPY gulpfile.js ./
COPY .editorconfig ./

FROM source as dist
RUN gulp dist

FROM source as test
RUN npm run eclint-check
RUN npm run prettier-check
