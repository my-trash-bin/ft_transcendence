FROM node:18

WORKDIR /usr/src/app

COPY project/frontend .

RUN npm install && npm run build && npm install --omit=dev

EXPOSE 80

CMD ["npm", "start"]
