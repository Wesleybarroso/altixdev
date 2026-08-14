import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: configRow, error: configError } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "VERCEL_TOKEN")
      .maybeSingle();

    const vercelToken = configRow?.value ?? "";

    const { data: projects, error: dbError } = await supabase
      .from("portfolio_projects")
      .select("id, vercel_project_name, display_name, description, category, url, sort_order")
      .order("sort_order", { ascending: true });

    if (dbError) throw new Error(dbError.message);

    const enriched = await Promise.all(
      (projects ?? []).map(async (project) => {
        const live = await fetchVercelProject(project.vercel_project_name, vercelToken);
        return {
          ...project,
          state: live?.state ?? "UNKNOWN",
          target: project.url,
          updatedAt: live?.ready ?? live?.created ?? null,
        };
      })
    );

    return new Response(JSON.stringify({ projects: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, projects: [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function fetchVercelProject(name: string, token: string): Promise<any> {
  if (!token) return null;
  try {
    const res = await fetch(`https://api.vercel.com/v6/deployments?app=${encodeURIComponent(name)}&limit=1&production=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.deployments?.[0] ?? null;
  } catch {
    return null;
  }
}
