import { createTestEnv } from "./worker-integration-env.mjs";
import { assertInboundEmailIntake } from "./worker-integration-inbound-email-assertions.mjs";
import { createNestedAttachmentEmailFixture } from "./worker-integration-inbound-email-fixture.mjs";
import {
  createEmailExecutionContext,
  createInboundEmailMessage,
} from "./worker-integration-inbound-email-message.mjs";

export async function testInboundEmailIntake(worker) {
  const env = await createTestEnv();
  const rawEmail = createNestedAttachmentEmailFixture();

  await worker.email(createInboundEmailMessage(rawEmail), env, createEmailExecutionContext());

  await assertInboundEmailIntake(env);
}
