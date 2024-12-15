FROM node:20-alpine as build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV JWT_SECRET=296f969e6f2d81d567eec0ff193a01ea7405bc8837d0a57617fef179ddb9846ca5f65204c63d80441a1a71f35e793837161d8032c00b3d0db1f442246186bbaf

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/env/development.env /app/env/development.env

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV JET_LOGGER_MODE=CONSOLE
ENV JET_LOGGER_FILEPATH=jet-logger.log
ENV JET_LOGGER_TIMESTAMP=TRUE
ENV JET_LOGGER_FORMAT=LINE

CMD ["node", "dist/index.js"]

EXPOSE 3000
