FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm i
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build

FROM nginx:alpine as serve
COPY --from=build /app/dist/freelo/browser /usr/share/nginx/html
