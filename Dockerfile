FROM httpd:2.4-alpine

ADD ./tpo.zip /usr/local/apache2/htdocs/
RUN apk add unzip
RUN cd /usr/local/apache2/htdocs/ && unzip -o /usr/local/apache2/htdocs/tpo.zip