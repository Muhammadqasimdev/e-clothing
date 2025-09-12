FROM node:20-alpine

RUN apk add --no-cache git curl

WORKDIR /app

RUN npm install -g nx

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000 4200

CMD ["yarn", "start:all"]
