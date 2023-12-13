FROM node:18

ARG NEXT_PUBLIC_API_ENDPOINT
ENV NEXT_PUBLIC_API_ENDPOINT $NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_UPLOADS_BASE
ENV NEXT_PUBLIC_UPLOADS_BASE $NEXT_PUBLIC_UPLOADS_BASE
ARG NEXT_PUBLIC_WS_ENDPOINT
ENV NEXT_PUBLIC_WS_ENDPOINT $NEXT_PUBLIC_WS_ENDPOINT

# in environment using self-signed certificate
ENV NODE_TLS_REJECT_UNAUTHORIZED 0

WORKDIR /usr/src/app

COPY project/frontend .

RUN npm install && npx prisma generate && npm run build && npm install --omit=dev

EXPOSE 80

CMD ["npm", "start"]
