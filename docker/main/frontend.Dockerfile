FROM node:18

WORKDIR /usr/src/app

COPY project/frontend .

RUN npm install --omit=dev && npm run build

EXPOSE 80

ENV NODE_ENV=development

CMD ["npm", "start", "--", "--port", "80"]
