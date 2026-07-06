export function assertOperationsWranglerGuards(context) {
  const { assert, wranglerConfig } = context;

  assert(
    wranglerConfig.includes("SOURCE_FILES") &&
      wranglerConfig.includes("DB") &&
      wranglerConfig.includes("IMPORT_JOBS") &&
      wranglerConfig.includes('"send_email"') &&
      wranglerConfig.includes('"EMAIL"') &&
      wranglerConfig.includes('"EMAIL_DELIVERY_MODE"') &&
      wranglerConfig.includes('"MAIL_FROM"') &&
      wranglerConfig.includes('"MAIL_REPLY_TO"') &&
      wranglerConfig.includes('"PUBLIC_APP_URL"'),
    "wrangler config must declare DB, SOURCE_FILES, IMPORT_JOBS, EMAIL, and public URL/mail vars.",
  );
  assert(
    wranglerConfig.includes('"env"') &&
      wranglerConfig.includes('"preview"') &&
      wranglerConfig.includes('"production"') &&
      wranglerConfig.includes('"carboti-worker-preview"') &&
      wranglerConfig.includes('"carboti-worker-production"'),
    "wrangler config must declare preview and production environments.",
  );
  assert(
    wranglerConfig.includes('"assets"') &&
      wranglerConfig.includes('"directory": "../web/dist"') &&
      wranglerConfig.includes('"not_found_handling": "single-page-application"') &&
      wranglerConfig.includes('"/api/*"') &&
      wranglerConfig.includes('"/health"'),
    "preview and production wrangler environments must serve same-origin web assets while routing API paths to the Worker.",
  );
  assert(
    wranglerConfig.includes("dead_letter_queue") &&
      wranglerConfig.includes("carboti-import-jobs-preview-dlq") &&
      wranglerConfig.includes("carboti-import-jobs-production-dlq") &&
      wranglerConfig.includes('"max_retries": 3'),
    "wrangler queue consumers must declare retry and DLQ configuration.",
  );
  assert(
    wranglerConfig.includes("REPLACE_WITH_PREVIEW_D1_DATABASE_ID") &&
      wranglerConfig.includes("REPLACE_WITH_PRODUCTION_D1_DATABASE_ID"),
    "wrangler remote environments must use obvious D1 database ID placeholders.",
  );
  assert(
    wranglerConfig.includes('"compatibility_date": "2026-06-24"'),
    "wrangler compatibility_date must stay within wrangler@4.103.0 local runtime support.",
  );
}
