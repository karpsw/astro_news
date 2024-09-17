#!/bin/sh -x
PATH=$PATH:/bin:/usr/bin/:/usr/local/bin:/usr/sbin:/sbin
DIRSRC=/var/apps/astronews/src

df -h

echo "load git fetch"
cd $DIRSRC

git reset --hard
git fetch
#git pull origin main
git checkout main
git pull origin main


docker cp /var/apps/astronews/src/docker/nginx/nginx.conf astronews-nginx-purge-img:/etc/nginx/nginx.conf
docker exec astronews-nginx-purge-img nginx -s reload