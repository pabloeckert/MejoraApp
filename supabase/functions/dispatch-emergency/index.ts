/**
 * dispatch-emergency — Protocolo de Emergencia Empresarial (< 60 min SLA)
 *
 * Verifica nivel y cupo semanal en servidor (N1: max 3/sem, N2/ADMIN: ilimitado),
 * registra en public.emergencies y despacha correo prioritario (Resend) + Push Admin + URL WhatsApp.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import webpush from "npm:web-push@3.6.7";
import { withMiddleware } from "../_shared/middleware.ts";
import { jsonHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { emergencyDispatchSchema, formatZodError } from "../_shared/schemas.ts";

const WA_NUMBER = "543764358152";
const WEEKLY_LIMIT_N1 = 3;

function stripTags(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim();
}

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 5 }, async (req, ctx) => {
    const headers = { ...jsonHeaders(ctx.origin) };

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
    }

    const rawBody = await req.json().catch(() => null);
    const parsed = emergencyDispatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), { status: 400, headers });
    }

    const user = ctx.user!;
    const crisisType = stripTags(parsed.data.crisisType);
    const impactText = stripTags(parsed.data.message);
    const cleanPhone = stripTags(parsed.data.contactPhone ?? "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    try {
      const [{ data: profile }, { data: diagnostic }] = await Promise.all([
        supabase
          .from("profiles")
          .select("nombre, apellido, empresa, cargo, access_level, membership_expires_at, phone, whatsapp, email")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("diagnostic_results")
          .select("perfil, puntaje_total")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const rawAccess = (profile?.access_level ?? "N0").toUpperCase();
      const expiresAt = profile?.membership_expires_at ? new Date(profile.membership_expires_at) : null;
      const isExpired = expiresAt ? expiresAt < new Date() : false;
      const effectiveLevel = isExpired && rawAccess !== "ADMIN" ? "N0" : rawAccess;
      const isN2OrAdmin = effectiveLevel === "N2" || effectiveLevel === "ADMIN";

      if (effectiveLevel === "N0") {
        return new Response(
          JSON.stringify({ error: "El Protocolo de Emergencia requiere membresía N1 o Círculo Dorado N2." }),
          { status: 403, headers }
        );
      }

      if (!isN2OrAdmin) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count } = await supabase
          .from("emergencies")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", weekAgo.toISOString());

        if ((count ?? 0) >= WEEKLY_LIMIT_N1) {
          return new Response(
            JSON.stringify({ error: "Alcanzaste el límite semanal de Nivel 1 (3 activaciones). Subí a N2 para cobertura ilimitada." }),
            { status: 429, headers }
          );
        }
      }

      const effectivePhone = cleanPhone || profile?.whatsapp || profile?.phone || "";
      const phoneSegment = effectivePhone ? ` | Tel: ${effectivePhone}` : "";
      const structuredMessage = `[${crisisType}] ${impactText}${phoneSegment}`.slice(0, 500);

      // 1. Dispatch priority email via Resend (best-effort)
      let emailDispatched = false;
      const resendKey = Deno.env.get("RESEND_API_KEY") || "";
      const alertRecipient = Deno.env.get("EMERGENCY_ALERT_EMAIL") || "admin@mejoraok.com";
      const fromEmail = Deno.env.get("FROM_EMAIL") || "MejoraApp Guardia <hola@mejoraok.com>";

      const leaderName = [profile?.nombre, profile?.apellido].filter(Boolean).join(" ") || user.email || "Líder MejoraApp";
      const companyName = profile?.empresa || "Empresa no especificada";

      if (resendKey) {
        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: alertRecipient,
              subject: `🚨 [${isN2OrAdmin ? "N2 <60m SLA" : "N1"}] Emergencia: ${crisisType} — ${leaderName} (${companyName})`,
              html: `
                <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #E1061E; border-radius: 12px; padding: 24px; background: #FFFFFF;">
                  <span style="display:inline-block; background:#E1061E; color:#FFFFFF; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:800; text-transform:uppercase;">
                    Guardia Ejecutiva · ${isN2OrAdmin ? "Prioridad N2 (< 60 min SLA)" : "Nivel 1"}
                  </span>
                  <h2 style="color:#0F172A; margin:16px 0 8px;">Activación de Botón de Emergencia</h2>
                  <p style="color:#475569; margin:0 0 16px;"><strong>Líder:</strong> ${leaderName} (${profile?.cargo || "Dirección"}) · <strong>Empresa:</strong> ${companyName}</p>
                  <div style="background:#F8FAFC; border-left:4px solid #1A3D84; padding:12px 16px; margin-bottom:16px;">
                    <p style="margin:0 0 6px;"><strong>Tipo de crisis:</strong> ${crisisType}</p>
                    <p style="margin:0 0 6px;"><strong>Impacto reportado:</strong> ${impactText}</p>
                    <p style="margin:0;"><strong>Teléfono directo:</strong> ${effectivePhone || "No informado"} · <strong>Email:</strong> ${profile?.email || user.email || "N/A"}</p>
                  </div>
                  ${diagnostic?.perfil ? `<p style="font-size:13px; color:#64748B;">Mirror Estratégico reciente: <strong>${diagnostic.perfil}</strong> (${diagnostic.puntaje_total ?? 0}/40 pts)</p>` : ""}
                </div>
              `,
            }),
          });
          emailDispatched = emailRes.ok;
          if (!emailRes.ok) {
            logWarn("dispatch-emergency", "Resend failed", { status: emailRes.status });
          }
        } catch (err) {
          logWarn("dispatch-emergency", "Resend exception", { error: String(err) });
        }
      }

      // 2. Dispatch push to admin subscribers (best-effort)
      let pushDispatched = false;
      const vapidPub = Deno.env.get("VAPID_PUBLIC_KEY") || "";
      const vapidPriv = Deno.env.get("VAPID_PRIVATE_KEY") || "";
      const vapidSubj = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@mejoraok.com";

      if (vapidPub && vapidPriv) {
        try {
          const { data: adminRoles } = await supabase
            .from("user_roles")
            .select("user_id")
            .eq("role", "admin");

          const adminIds = (adminRoles ?? []).map((r) => r.user_id);
          if (adminIds.length > 0) {
            const { data: subs } = await supabase
              .from("push_subscriptions")
              .select("id, endpoint, keys_p256dh, keys_auth")
              .in("user_id", adminIds);

            if (subs && subs.length > 0) {
              webpush.setVapidDetails(vapidSubj, vapidPub, vapidPriv);
              let okCount = 0;
              for (const sub of subs) {
                try {
                  await webpush.sendNotification(
                    {
                      endpoint: sub.endpoint,
                      keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
                    },
                    JSON.stringify({
                      title: `🚨 Emergencia ${isN2OrAdmin ? "N2" : "N1"}: ${crisisType}`,
                      body: `${leaderName} (${companyName}): ${impactText.slice(0, 80)}`,
                      url: "/admin",
                      tag: "emergency-alert",
                    })
                  );
                  okCount++;
                } catch {
                  // ignore stale endpoint here
                }
              }
              pushDispatched = okCount > 0;
            }
          }
        } catch (err) {
          logWarn("dispatch-emergency", "Admin push error", { error: String(err) });
        }
      }

      // 3. Persist emergency ticket
      const nowIso = new Date().toISOString();
      const { data: ticket, error: insertError } = await supabase
        .from("emergencies")
        .insert({
          user_id: user.id,
          crisis_type: crisisType,
          contact_phone: effectivePhone || null,
          message: structuredMessage,
          whatsapp_sent: true,
          email_sent: emailDispatched,
          push_sent: pushDispatched,
          status: "open",
          sent_at: nowIso,
        })
        .select("id, message, whatsapp_sent, email_sent, push_sent, sent_at, created_at")
        .single();

      if (insertError) {
        logError("dispatch-emergency", "DB insert failed", { error: insertError.message });
        return new Response(JSON.stringify({ error: "No se pudo registrar el ticket" }), {
          status: 500,
          headers,
        });
      }

      const waLines = [
        `🚨 PROTOCOLO DE EMERGENCIA EMPRESARIAL (${isN2OrAdmin ? "PRIORIDAD N2 < 60 MIN SLA" : "GUARDIA N1"})`,
        `• Tipo de Crisis: ${crisisType}`,
        `• Impacto actual: ${impactText}`,
        effectivePhone ? `• Teléfono directo: ${effectivePhone}` : null,
      ].filter(Boolean);

      const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waLines.join("\n"))}`;

      logInfo("dispatch-emergency", "Emergency dispatched", {
        ticketId: ticket.id,
        userId: user.id,
        level: effectiveLevel,
        emailDispatched,
        pushDispatched,
      });

      return new Response(
        JSON.stringify({
          ticket,
          emailDispatched,
          pushDispatched,
          whatsappUrl,
        }),
        { status: 200, headers }
      );
    } catch (e) {
      logError("dispatch-emergency", "Unhandled error", { error: String(e) });
      return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
        status: 500,
        headers,
      });
    }
  })
);
