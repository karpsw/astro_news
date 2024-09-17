 docker cp nginx.conf astronews-nginx-purge-img:/etc/nginx/nginx.conf
 docker exec astronews-nginx-purge nginx -s reload