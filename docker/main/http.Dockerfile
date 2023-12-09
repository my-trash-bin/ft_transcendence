FROM nginx:1.25.3-alpine-slim

RUN apk add --no-cache nginx-mod-http-headers-more openssl dumb-init && openssl req -x509 -nodes -days 1825 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -keyout /root/root-ca.key -out /root/root-ca.crt -subj "/C=KR/ST=SEOUL/L=GANGNAM/O=42seoul/OU=student/CN=klew"

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 443 4242

CMD ["dumb-init", "--", "nginx", "-g", "daemon off;"]
