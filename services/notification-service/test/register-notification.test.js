import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RegisterNotificationUseCase } from '../src/application/RegisterNotificationUseCase.js';
import { InMemoryNotificationRepository } from '../src/infrastructure/InMemoryNotificationRepository.js';

describe('RegisterNotificationUseCase', () => {
  it('stores a notification with default channel', async () => {
    const repository = new InMemoryNotificationRepository();
    const useCase = new RegisterNotificationUseCase(repository);

    const notification = await useCase.execute({ message: 'Pedido criado' });

    assert.equal(notification.channel, 'internal');
    assert.equal((await repository.findAll()).length, 1);
  });
});
