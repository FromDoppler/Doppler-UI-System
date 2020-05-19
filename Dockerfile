FROM node:12.16.3 as source
WORKDIR /work

RUN npm install -g gulp
COPY package-lock.json package.json npm-shrinkwrap.json ./
RUN npm install

COPY assets/ ./assets/
COPY gulpfile.js ./
COPY .editorconfig ./

FROM source as test
RUN npm run eclint-check
RUN npm run prettier-check

FROM source as dist
RUN gulp dist
