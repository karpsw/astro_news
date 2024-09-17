 docker cp nginx.conf astronews-nginx-purge-img:/etc/nginx/nginx.conf
 docker exec astronews-nginx-purge-img nginx -s reload