FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY services/notification-service ./services/notification-service
EXPOSE 3003
CMD ["npm", "run", "start:notifications"]
