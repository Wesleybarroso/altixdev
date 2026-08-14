/*
# Create site_config table for server-side secrets

1. New Tables
- `site_config`
  - `id` (uuid, primary key)
  - `key` (text, unique, not null) — config key name
  - `value` (text, not null) — config value (stored as text)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `site_config`.
- NO anon/authenticated policies — only the service role (used by edge functions) can read/write.
  This keeps secrets like the Vercel API token invisible to the frontend.
3. Seed Data
- VERCEL_TOKEN with the user's provided token.
*/

CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- No policies: only the service role (edge functions) can access this table.
-- anon and authenticated roles get zero rows.

INSERT INTO site_config (key, value) VALUES
  ('VERCEL_TOKEN', 'vcp_1woi9dzyNouG8oAYH7kqfMhE4b4F820Uu2jVnLm5IhCgrSoJF32QvGp9')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
