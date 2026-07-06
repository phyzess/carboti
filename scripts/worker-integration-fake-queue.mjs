export class FakeQueue {
  constructor() {
    this.messages = [];
  }

  async send(message) {
    this.messages.push(message);
  }
}
