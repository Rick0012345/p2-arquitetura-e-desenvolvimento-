FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY services/catalog-service ./services/catalog-service
EXPOSE 3001
CMD ["npm", "run", "start:catalog"]
