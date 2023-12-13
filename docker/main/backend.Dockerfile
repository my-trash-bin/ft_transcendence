FROM node:18

WORKDIR /usr/src/app

COPY project/backend .

RUN npm install && npx prisma generate && npm run build && npm install --omit=dev

EXPOSE 80 4242

CMD ["sh", "-c", "npx -y prisma migrate deploy && npm start"]
