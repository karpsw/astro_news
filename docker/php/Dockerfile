FROM php:8.2-fpm



RUN apt-get update
#RUN apt-get install memcached -y

RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN apt install -y libmemcached-dev zlib1g-dev libssl-dev

RUN yes '' | pecl install -f memcached-3.2.0 \
  && docker-php-ext-enable memcached

#RUN apt-get update \
# && apt-get install -y git zlib1g-dev \
# && docker-php-ext-install pdo pdo_mysql zip

#RUN apt install -y libmemcached-dev zlib1g-dev libssl-dev
 