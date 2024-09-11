FROM node:lts AS runtime
WORKDIR /app

COPY . /app/

#RUN npm install
#RUN npm run build

RUN yarn install

ARG ARG_SITE_URL
ENV SITE_URL=$ARG_SITE_URL
RUN echo "SITE_URL=$SITE_URL"

RUN yarn build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs