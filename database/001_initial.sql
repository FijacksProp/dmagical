CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_type VARCHAR(40) NOT NULL CHECK (enquiry_type IN (
    'general-enquiry', 'service-enquiry', 'partnership',
    'investment', 'venture-enquiry', 'media-request'
  )),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(30) NOT NULL DEFAULT '',
  company VARCHAR(160) NOT NULL DEFAULT '',
  subject VARCHAR(140) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 3000),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'not_configured', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx
  ON contact_messages (status, created_at DESC);

CREATE TABLE IF NOT EXISTS api_rate_limits (
  ip_hash CHAR(64) NOT NULL,
  route VARCHAR(80) NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count > 0),
  PRIMARY KEY (ip_hash, route, window_start)
);
