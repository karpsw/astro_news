
FROM node:20.13.1-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
#COPY package*.json ./

# override sharp 0.32.6 with 0.33.3, fails without this
RUN yarn remove sharp
RUN yarn add --ignore-engines sharp@0.33.4

RUN yarn build
#RUN npm install




ENV HOST=0.0.0.0
ENV PORT=4000
EXPOSE 4000
CMD node ./dist/server/entry.mjs

#CMD yarn start
#CMD node ./dist/server/entry.mjs
#CMD ["node", "run", "start"]
#CMD ["node", "./dist/server/entry.mjs"]
