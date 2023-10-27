FROM nginx:alpine

RUN apk add --no-cache nginx-mod-http-headers-more dumb-init

COPY docker/dev/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["dumb-init", "--", "nginx", "-g", "daemon off;"]
