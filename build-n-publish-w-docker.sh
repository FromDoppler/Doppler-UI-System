#!/usr/bin/env bash

pkgName="doppler-ui-library"
pkgVersion=${1:-"v0.0.0-build0"}
cdnBaseUrl=${2:-"//cdn.fromdoppler.com/$pkgName"}

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

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl

echo Publishing to our new CDN using SFTP
echo "Destination: ${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:${CDN_SFTP_PORT}:/${CDN_SFTP_BASE}/${pkgName}/${pkgVersion}"
# Using specific digest (f7f7607...) to avoid unwanted changes in the non-oficial image
docker run --rm \
    -v /var/lib/jenkins/.ssh:/root/.ssh:ro \
    -v "$(pwd)/dist:/source/${pkgName}/${pkgVersion}" \
    ttionya/openssh-client@sha256:f7f7607d56f09a7c42e246e9c256ff51cf2f0802e3b2d88da6537bea516fe142 \
    scp -P "${CDN_SFTP_PORT}" -r /source/${pkgName} "${CDN_SFTP_USERNAME}@${CDN_SFTP_HOSTNAME}:/${CDN_SFTP_BASE}/"
echo "Files ready in https://cdn.fromdoppler.com/${pkgName}/${pkgVersion}"
