FROM node:18

WORKDIR /usr/src/app

COPY project/backend .

RUN npm install

EXPOSE 8080

ENV NODE_ENV=development

CMD ["npm", "start"]
