FROM node:12.20.0 as source
WORKDIR /work

COPY package-lock.json package.json npm-shrinkwrap.json ./
RUN npm install

COPY assets/ ./assets/
COPY .editorconfig ./

FROM source as test
RUN npm run eclint-check
RUN npm run prettier-check

FROM source as dist
RUN npm run dist
