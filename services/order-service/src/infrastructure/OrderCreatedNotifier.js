export class OrderCreatedNotifier {
  constructor(observers = []) {
    this.observers = observers;
  }

  async notify(order) {
    await Promise.all(this.observers.map((observer) => observer.update(order)));
  }
}
