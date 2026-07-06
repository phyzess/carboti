ALTER TABLE carboti_webhook_deliveries ADD COLUMN workspace_id TEXT;
ALTER TABLE carboti_webhook_deliveries ADD COLUMN processor_id TEXT;
ALTER TABLE carboti_webhook_deliveries ADD COLUMN processor_run_id TEXT;
ALTER TABLE carboti_webhook_deliveries ADD COLUMN message_id TEXT;
ALTER TABLE carboti_webhook_deliveries ADD COLUMN input_object_id TEXT;
ALTER TABLE carboti_webhook_deliveries ADD COLUMN retry_of_delivery_id TEXT;

CREATE INDEX IF NOT EXISTS carboti_webhook_deliveries_workspace_status_idx
  ON carboti_webhook_deliveries (workspace_id, status, created_at);

CREATE INDEX IF NOT EXISTS carboti_webhook_deliveries_processor_run_idx
  ON carboti_webhook_deliveries (processor_run_id);

CREATE INDEX IF NOT EXISTS carboti_webhook_deliveries_retry_idx
  ON carboti_webhook_deliveries (retry_of_delivery_id, created_at);
