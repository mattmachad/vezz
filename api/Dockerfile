FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["node", "dist/index.js"]

