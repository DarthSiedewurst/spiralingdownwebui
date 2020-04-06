FROM node:12
MAINTAINER marcomueller
EXPOSE 5000
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
CMD npm run start