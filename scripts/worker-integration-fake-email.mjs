export class FakeEmailSender {
  constructor(options = {}) {
    this.fail = options.fail === true;
    this.messages = [];
  }

  async send(message) {
    if (this.fail) {
      throw new Error("Simulated email failure");
    }

    this.messages.push(message);
    return {
      messageId: `email-${this.messages.length}`,
    };
  }
}
