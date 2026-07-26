CREATE TABLE IF NOT EXISTS partnership_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_type VARCHAR(40) NOT NULL CHECK (partnership_type IN (
    'strategic-business', 'investment', 'franchise',
    'corporate-collaboration', 'technical', 'institutional'
  )),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(30) NOT NULL DEFAULT '',
  organization VARCHAR(160) NOT NULL,
  role VARCHAR(120) NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  message TEXT NOT NULL CHECK (char_length(message) <= 3000),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'contacted', 'qualified', 'declined', 'archived')),
  notification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'not_configured', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS partnership_enquiries_status_created_idx
  ON partnership_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS partnership_enquiries_type_created_idx
  ON partnership_enquiries (partnership_type, created_at DESC);
