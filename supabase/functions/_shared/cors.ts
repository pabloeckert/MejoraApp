// Shared CORS helper for MejoraApp Edge Functions
// Import: import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const ALLOWED_ORIGINS = [
  "https://app.mejoraok.com",
  "https://mejoraapp.mejoraok.com",
  "https://mejoraok.com",
  "https://mejoraapp.vercel.app",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*mejoraok\.com$/.test(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/localhost:[0-9]+$/.test(origin)) return true;
  return false;
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin) ? origin! : (origin || "https://app.mejoraok.com");
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };
}

/** Returns CORS preflight response if method is OPTIONS, otherwise null */
export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req.headers.get("Origin")) });
  }
  return null;
}

/** Build JSON response headers with CORS */
export function jsonHeaders(origin: string | null): Record<string, string> {
  return { ...getCorsHeaders(origin), "Content-Type": "application/json" };
}
