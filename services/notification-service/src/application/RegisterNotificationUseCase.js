import { Notification } from '../domain/Notification.js';

export class RegisterNotificationUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(input) {
    const notification = new Notification({
      id: crypto.randomUUID(),
      message: input.message,
      channel: input.channel
    });

    return this.notificationRepository.save(notification);
  }
}
