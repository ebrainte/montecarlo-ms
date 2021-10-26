FROM httpd:2.4-alpine
RUN apk add unzip
RUN unzip 
COPY ./files /usr/local/apache2/htdocs/