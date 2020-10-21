FROM node:carbon-slim as build

WORKDIR /usr/src/web

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ARG PORT
ENV PORT ${PORT}

ARG API_URL
ENV REACT_APP_API_URL ${API_URL}

COPY package.json package-lock.json* ./
RUN npm i

COPY . .

RUN npm run-script build

FROM socialengine/nginx-spa
COPY --from=build /usr/src/web/build /app
EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
