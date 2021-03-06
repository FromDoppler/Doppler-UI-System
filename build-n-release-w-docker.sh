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

docker build --pull -t doppler-ui-system-source --target test .

# for local testing run in master and in dry-run mode
# -->&& ./node_modules/.bin/semantic-release --dry-run
docker run --rm \
    -e GH_TOKEN \
    -e "NPM_TOKEN=00000000-0000-0000-0000-000000000000" \
    -v `pwd`/.git:/work/.git \
    -v `pwd`/dist:/work/result \
    -w /work \
    doppler-ui-system-source \
    /bin/sh -c "\
      mkdir -p dist \
      && rm -rf ./dist/* \
      && ./node_modules/.bin/semantic-release \
      && chmod +777 -R --quiet ./dist/* \
      && cp -R ./dist/* ./result/ \
    "

# It seems that due a change in semantic release, when no version is generated
# there is an error status code, so the following code is never executed.
# I keeped it in case if, in the future, we configure semantic release in a
# different way.
versionFile=./dist/version.txt

if test ! -f "$versionFile"; then
  echo $versionFile does not exists, finishing without error...
  exit 0
fi

# read pkgVersion from version.txt (see package.json => $.release.prepare[?(@.path=="@semantic-release/exec")])
pkgVersion=v$(cat "$versionFile")

echo Publishing to our new CDN using SFTP
echo "Destination: ${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:${CDN_SFTP_PORT}:/${CDN_SFTP_BASE}/${pkgName}/${pkgVersion}"
# Using specific digest (f7f7607...) to avoid unwanted changes in the non-oficial image
docker run --rm \
    -v /var/lib/jenkins/.ssh:/root/.ssh:ro \
    -v "$(pwd)/dist:/source/${pkgName}/${pkgVersion}" \
    ttionya/openssh-client@sha256:f7f7607d56f09a7c42e246e9c256ff51cf2f0802e3b2d88da6537bea516fe142 \
    scp -P "${CDN_SFTP_PORT}" -r /source/${pkgName} "${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:/${CDN_SFTP_BASE}/"
echo "Files ready in https://cdn.fromdoppler.com/${pkgName}/${pkgVersion}"

echo Publishing to our new CDN using SFTP
echo "Destination: ${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:${CDN_SFTP_PORT}:/${CDN_SFTP_BASE}/${pkgName}/latest"
# Using specific digest (f7f7607...) to avoid unwanted changes in the non-oficial image
docker run --rm \
    -v /var/lib/jenkins/.ssh:/root/.ssh:ro \
    -v "$(pwd)/dist:/source/${pkgName}/latest" \
    ttionya/openssh-client@sha256:f7f7607d56f09a7c42e246e9c256ff51cf2f0802e3b2d88da6537bea516fe142 \
    scp -P "${CDN_SFTP_PORT}" -r /source/${pkgName} "${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:/${CDN_SFTP_BASE}/"
echo "Files ready in https://cdn.fromdoppler.com/${pkgName}/latest"
