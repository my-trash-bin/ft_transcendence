FROM node:18

WORKDIR /usr/src/app

COPY project/backend .

RUN npm install --omit=dev

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
