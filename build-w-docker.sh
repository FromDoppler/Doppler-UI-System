#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd $(dirname $0)

# To avoid issues with MINGW y Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

mkdir -p dist

docker build --pull -t doppler-ui-system-source .
docker run --rm \
    -v `pwd`/dist:/work/dist \
    -p 3500:3500 \
    doppler-ui-system-source \
    /bin/sh -c "\
      rm -rf ./dist/* \
      && ./node_modules/.bin/eclint check \"**/*\" \
      && gulp dist \
      && chmod +777 -R --quiet ./dist/* \
    "
