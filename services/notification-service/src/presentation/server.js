import http from 'node:http';
import { ListNotificationsUseCase } from '../application/ListNotificationsUseCase.js';
import { RegisterNotificationUseCase } from '../application/RegisterNotificationUseCase.js';
import { InMemoryNotificationRepository } from '../infrastructure/InMemoryNotificationRepository.js';
import { readJson, sendJson } from './http.js';

const port = process.env.PORT || 3003;
const repository = new InMemoryNotificationRepository();
const registerNotification = new RegisterNotificationUseCase(repository);
const listNotifications = new ListNotificationsUseCase(repository);

const server = http.createServer(async (request, response) => {
  try {
    if (request.url === '/health') {
      return sendJson(response, 200, { status: 'ok', service: 'notification-service' });
    }

    if (request.method === 'GET' && request.url === '/notifications') {
      return sendJson(response, 200, await listNotifications.execute());
    }

    if (request.method === 'POST' && request.url === '/notifications') {
      const notification = await registerNotification.execute(await readJson(request));
      return sendJson(response, 201, notification);
    }

    return sendJson(response, 404, { error: 'Route not found' });
  } catch (error) {
    return sendJson(response, 400, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`notification-service running on port ${port}`);
});
