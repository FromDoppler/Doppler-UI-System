#!/usr/bin/env bash

pkgName="doppler-ui-library"
cdnBaseUrl=${1:-"//cdn.fromdoppler.com/$pkgName"}

# Stop script on NZEC
set -e
# Stop script if unbound variable found (use ${var:-} if intentional)
set -u

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd $(dirname $0)

# To avoid issues with MINGW y Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# Consider running this when local environment differs from docker environment
# rm-rf node-modules

mkdir -p dist

docker run --rm \
    -e GH_TOKEN \
    -e "NPM_TOKEN=00000000-0000-0000-0000-000000000000" \
    -v `pwd`:/work \
    -w /work \
    node:10 \
    /bin/sh -c "\
      rm -rf ./dist/* \
      && npm install -g gulp \
      && npm install \
      && ./node_modules/.bin/semantic-release \
      && chmod +777 -R --quiet ./dist/* \
    "

versionFile=./dist/version.txt

if test -f "versionFile"; then
  # read pkgVersion from version.txt (see package.json => $.release.prepare[?(@.path=="@semantic-release/exec")])
  pkgVersion=v$(cat "$versionFile")

  echo Publishing to Akamai...
  echo pkgName: $pkgName
  echo pkgVersion: $pkgVersion
  echo cdnBaseUrl: $cdnBaseUrl

  docker run --rm \
      -e AKAMAI_CDN_HOSTNAME \
      -e AKAMAI_CDN_USERNAME \
      -e AKAMAI_CDN_PASSWORD \
      -e AKAMAI_CDN_CPCODE \
      -e "PROJECT_NAME=$pkgName" \
      -e "VERSION_NAME=$pkgVersion" \
      -v `pwd`/dist:/source \
      dopplerrelay/doppler-relay-akamai-publish

  docker run --rm \
      -e AKAMAI_CDN_HOSTNAME \
      -e AKAMAI_CDN_USERNAME \
      -e AKAMAI_CDN_PASSWORD \
      -e AKAMAI_CDN_CPCODE \
      -e "PROJECT_NAME=$pkgName" \
      -e "VERSION_NAME=latest" \
      -v `pwd`/dist:/source \
  dopplerrelay/doppler-relay-akamai-publish
fi
