FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY services/order-service ./services/order-service
EXPOSE 3002
CMD ["npm", "run", "start:orders"]
