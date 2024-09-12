FROM nginx:1.20

RUN echo "STEP1--->"
#COPY  ssl /etc/nginx/conf.d/ssl/
COPY ./../nginx.conf /etc/nginx/nginx.conf

RUN echo "STEP2--->"

ADD default.conf /etc/nginx/conf.d/default.conf

RUN echo "STEP3--->"
