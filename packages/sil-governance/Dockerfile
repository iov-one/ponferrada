# This docker file takes a local build from the ./dist directory and just
# creates a webserver container. So be sure to have a clean build.

# See https://hub.docker.com/_/nginx/
FROM nginx:1.16-alpine

RUN mkdir /rw-volume
# Everything in here will be readable publicly!
RUN mkdir /web-data

# Nginx config
ADD ./docker/nginx.conf /etc/nginx/nginx.conf

# Copy application build
ADD ./build /web-data

# set permissions to folders and content
RUN chown -R nginx:nginx /rw-volume
RUN chown -R nginx:nginx /web-data

# We define this as a separate volume, so it is not affected by the --read-only flag
VOLUME ["/rw-volume"]

# and as a user nginx on non-privledged port
USER "nginx"
EXPOSE 3000
