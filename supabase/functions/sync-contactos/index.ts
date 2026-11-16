/**
 * sync-contactos — Proxy server-side seguro hacia MejoraContactos API
 *
 * Mueve CONTACTOS_API_URL y CONTACTOS_API_KEY fuera del bundle público del cliente.
 */
import { withMiddleware } from "../_shared/middleware.ts";
import { jsonHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn } from "../_shared/log.ts";
import { syncContactosSchema, formatZodError } from "../_shared/schemas.ts";

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 15 }, async (req, ctx) => {
    const headers = { ...jsonHeaders(ctx.origin) };

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers,
      });
    }

    const rawBody = await req.json().catch(() => null);
    const parsed = syncContactosSchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), {
        status: 400,
        headers,
      });
    }

    const contactosUrl = Deno.env.get("CONTACTOS_API_URL") || "";
    const contactosKey = Deno.env.get("CONTACTOS_API_KEY") || "";

    if (!contactosUrl || !contactosKey) {
      logWarn("sync-contactos", "CONTACTOS_API_URL / CONTACTOS_API_KEY not configured");
      return new Response(
        JSON.stringify({ skipped: true, reason: "Contactos gateway not configured" }),
        { status: 200, headers }
      );
    }

    const user = ctx.user!;
    const payload = parsed.data;
    const forwardedBody = {
      ...payload,
      email: payload.email || user.email,
      metadata: {
        ...(payload.metadata || {}),
        app_user_id: user.id,
      },
      nota_referencia:
        payload.nota_referencia || `[MejoraApp] Usuario sincronizado desde PWA (ID: ${user.id})`,
    };

    try {
      const upstream = await fetch(contactosUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": contactosKey,
          Authorization: `Bearer ${contactosKey}`,
        },
        body: JSON.stringify(forwardedBody),
      });

      if (!upstream.ok) {
        const errText = await upstream.text().catch(() => "");
        logWarn("sync-contactos", `Upstream HTTP ${upstream.status}`, { detail: errText.slice(0, 180) });
        return new Response(
          JSON.stringify({ skipped: true, status: upstream.status }),
          { status: 200, headers }
        );
      }

      const data = await upstream.json();
      logInfo("sync-contactos", "Contact synced", { userId: user.id, persona_id: data.persona_id });
      return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (e) {
      logWarn("sync-contactos", "Upstream unreachable", { error: String(e) });
      return new Response(JSON.stringify({ skipped: true }), { status: 200, headers });
    }
  })
);
