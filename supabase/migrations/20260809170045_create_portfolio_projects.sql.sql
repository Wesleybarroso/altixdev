/*
# Create portfolio_projects table (single-tenant, no auth)

1. New Tables
- `portfolio_projects`
  - `id` (uuid, primary key)
  - `vercel_project_name` (text, unique, not null) — the Vercel project identifier used to query the Vercel API
  - `display_name` (text, not null) — title shown on the portfolio card
  - `description` (text, not null) — short description shown on the card
  - `category` (text, not null) — filter category: Web, SaaS, Sistemas, Aplicativos
  - `url` (text, not null) — public URL of the deployed project
  - `sort_order` (integer, default 0) — display ordering
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `portfolio_projects`.
- Allow anon + authenticated SELECT (public portfolio data).
- No INSERT/UPDATE/DELETE from the anon key (managed via SQL/edge function only).
3. Seed Data
- Two initial projects matching the user's deployed Vercel sites.
*/

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vercel_project_name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Web',
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_portfolio_projects" ON portfolio_projects;
CREATE POLICY "anon_select_portfolio_projects"
ON portfolio_projects FOR SELECT
TO anon, authenticated USING (true);

INSERT INTO portfolio_projects (vercel_project_name, display_name, description, category, url, sort_order) VALUES
  ('espacoglamour', 'Espaço Glamour', 'Site institucional de estética e bem-estar, com identidade visual elegante e layout responsivo.', 'Web', 'https://espacoglamour.vercel.app/', 1),
  ('portifolio-lovat-tau-35', 'Portfólio Pessoal', 'Portfólio digital com galeria de projetos, animações sutis e experiência de navegação fluida.', 'Web', 'https://portifolio-lovat-tau-35.vercel.app/', 2)
ON CONFLICT (vercel_project_name) DO NOTHING;
