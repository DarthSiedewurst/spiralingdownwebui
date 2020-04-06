FROM node:12
MAINTAINER marcomueller
EXPOSE 5000
WORKDIR /app
COPY . /app
RUN npm install
RUN npm build
CMD npm run start