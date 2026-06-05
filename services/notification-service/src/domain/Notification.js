export class Notification {
  constructor({ id, message, channel }) {
    if (!message) throw new Error('Notification message is required');

    this.id = id;
    this.message = message;
    this.channel = channel || 'internal';
    this.createdAt = new Date().toISOString();
  }
}
