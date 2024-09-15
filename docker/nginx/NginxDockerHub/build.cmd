
docker build --build-arg ENABLED_MODULES="image-filter cachepurge" -t karpsw/nginx-purge-img:v03 .

docker login

docker push karpsw/nginx-purge-img:v03