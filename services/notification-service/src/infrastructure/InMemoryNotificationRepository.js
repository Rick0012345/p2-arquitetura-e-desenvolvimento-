export class InMemoryNotificationRepository {
  constructor() {
    this.notifications = [];
  }

  async save(notification) {
    this.notifications.push(notification);
    return notification;
  }

  async findAll() {
    return this.notifications;
  }
}
