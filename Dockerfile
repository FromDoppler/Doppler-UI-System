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
# returns non zero code, for now commented
# RUN ./node_modules/.bin/eclint check "**/*" 
RUN npm run prettier-check

