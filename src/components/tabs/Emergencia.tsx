/**
 * Emergencia — P08: Protocolo de Emergencia Empresarial (< 60 min SLA)
 *
 * Formulario táctico de 3 campos (Tipo de crisis, Impacto actual, Teléfono directo).
 * Registra cada activación en la tabla emergencies y despacha alerta por WhatsApp.
 * Límite: 3 usos por semana para N1, ilimitado con prioridad < 60 min para N2.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Phone,
  Clock,
  History,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WA_NUMBER } from "@/data/diagnosticData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { emergencyAlertSchema, formatZodError } from "@/lib/validation";
import { isAllowed } from "@/lib/rateLimit";

const WEEKLY_LIMIT_N1 = 3;

const CRISIS_TYPES = [
  "Caja / Financiera",
  "Conflicto Societario",
  "Fuga Comercial Crítica",
  "Crisis de Equipo Clave",
  "Operación Detenida",
] as const;

type CrisisType = (typeof CRISIS_TYPES)[number];

interface EmergencyRecord {
  id: string;
  message: string | null;
  whatsapp_sent: boolean | null;
  sent_at: string | null;
  created_at: string;
}

export default function Emergencia() {
  const { user } = useAuth();
  const { level } = useAccessLevel(user?.id);
  const { toast } = useToast();
  const [crisisType, setCrisisType] = useState<CrisisType>("Caja / Financiera");
  const [message, setMessage] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<EmergencyRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [weeklyUsed, setWeeklyUsed] = useState(0);

  // Pre-cargar teléfono del perfil si existe
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("phone")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.phone) setContactPhone(data.phone);
      });
  }, [user]);

  // Fetch emergency history
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("emergencies")
          .select("id, message, whatsapp_sent, sent_at, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (cancelled) return;
        if (error) throw error;

        if (data) {
          setHistory(data as EmergencyRecord[]);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const thisWeek = (data as EmergencyRecord[]).filter(
            (r) => new Date(r.created_at) > weekAgo
          );
          setWeeklyUsed(thisWeek.length);
        }
      } catch (err) {
        console.error("Error fetching emergency history:", err);
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [user, sending]);

  const isN2 = level === "N2" || level === "ADMIN";
  const isLimited = !isN2 && level === "N1";
  const isOverLimit = isLimited && weeklyUsed >= WEEKLY_LIMIT_N1;

  const handleEmergency = useCallback(async () => {
    if (!user || sending) return;

    const parsed = emergencyAlertSchema.safeParse({
      crisisType,
      message,
      contactPhone,
    });
    if (!parsed.success) {
      toast({
        title: "Revisá los datos de guardia",
        description: formatZodError(parsed.error),
        variant: "destructive",
      });
      return;
    }

    if (!isAllowed("emergency_alert")) {
      toast({
        title: "Guardia ya activada recientemente",
        description: "Ya registraste activaciones en la última hora. Si necesitás seguimiento urgente, escribí por WhatsApp directo.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const impactText = parsed.data.message || "Solicito intervención urgente de guardia.";
      const cleanPhone = parsed.data.contactPhone?.trim() || "";
      const phoneText = cleanPhone ? ` | Tel: ${cleanPhone}` : "";
      const structuredDbMessage = `[${parsed.data.crisisType}] ${impactText}${phoneText}`.slice(0, 500);

      const { error } = await supabase.from("emergencies").insert({
        user_id: user.id,
        message: structuredDbMessage,
        whatsapp_sent: true,
        sent_at: new Date().toISOString(),
      });
      if (error) throw error;

      const waLines = [
        `🚨 PROTOCOLO DE EMERGENCIA EMPRESARIAL (${isN2 ? "PRIORIDAD N2 < 60 MIN SLA" : "GUARDIA N1"})`,
        `• Tipo de Crisis: ${parsed.data.crisisType}`,
        `• Impacto actual: ${impactText}`,
        cleanPhone ? `• Teléfono directo: ${cleanPhone}` : null,
      ].filter(Boolean);

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waLines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");

      toast({
        title: "Protocolo de Emergencia activado",
        description: "Tu ticket quedó registrado y se abrió el canal directo de guardia.",
      });

      setMessage("");
    } catch (err) {
      console.error("Error registering emergency:", err);
      toast({
        title: "No se pudo registrar el ticket",
        description: "Intentá nuevamente o contactá por WhatsApp directo.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }, [user, sending, crisisType, message, contactPhone, isN2, toast]);

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Cabecera Bento de Guardia con Borde #E1061E */}
      <div
        className="bg-card rounded-2xl p-5 shadow-sm border-2 space-y-3"
        style={{ borderColor: "#E1061E" }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white"
            style={{ backgroundColor: "#E1061E" }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Guardia Ejecutiva · SLA &lt; 60 min
          </span>
          <span className="text-[11px] font-extrabold text-muted-foreground">
            {isN2 ? "Cobertura Ilimitada N2" : `${weeklyUsed}/${WEEKLY_LIMIT_N1} usos sem.`}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
            Botón de Emergencia Empresarial
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Ningún líder de Mejora Continua atraviesa una crisis en soledad. Activá el protocolo para recibir contención metodológica y dirección inmediata.
          </p>
        </div>

        {/* Criterio Medular en Crisis */}
        <div
          className="bg-secondary/60 border-l-4 px-3.5 py-2.5 rounded-r-xl flex items-start gap-2.5"
          style={{ borderLeftColor: "#1A3D84" }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1A3D84] dark:text-blue-400" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Criterio de Guardia:</strong> En medio del incendio no buscamos culpables; estabilizamos la caja, protegemos la relación crítica y ordenamos la decisión.
          </p>
        </div>
      </div>

      {/* Advertencia de límite semanal para N1 */}
      {isLimited && (
        <Card
          className={cn(
            "rounded-2xl border",
            isOverLimit
              ? "border-[#E1061E]/40 bg-[#E1061E]/5"
              : "border-[#F7CC13] bg-[#F7CC13]/10"
          )}
        >
          <CardContent className="p-3.5 flex items-center gap-3">
            <ShieldAlert
              className={cn(
                "w-5 h-5 shrink-0",
                isOverLimit ? "text-[#E1061E]" : "text-[#B48600]"
              )}
            />
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {isOverLimit
                  ? "Alcanzaste el límite semanal de Nivel 1"
                  : `Disponibilidad N1: ${weeklyUsed} de ${WEEKLY_LIMIT_N1} activaciones esta semana`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                El Círculo Dorado (N2) cuenta con activaciones ilimitadas y prioridad directa.
              </p>
            </div>
            {isOverLimit && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-extrabold border-[#1A3D84] text-[#1A3D84]"
                onClick={() => {
                  const text = encodeURIComponent(
                    "Hola! Quiero subir al Círculo Dorado (N2) para contar con protocolo de emergencia ilimitado."
                  );
                  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
                }}
              >
                Subir a N2
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formulario de 3 campos del Protocolo de Crisis */}
      <Card className="border-border rounded-2xl shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Campo 1: Tipo de crisis */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground block">
              1. Tipo de crisis a destrabar
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CRISIS_TYPES.map((type) => {
                const active = crisisType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCrisisType(type)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                      active
                        ? "bg-[#1A3D84] text-white border-[#1A3D84]"
                        : "bg-secondary/50 text-muted-foreground border-border hover:border-[#1A3D84]/40"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo 2: Impacto actual */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground block">
              2. Impacto actual y decisión urgente
            </label>
            <Textarea
              placeholder="Describí en 2 líneas qué se detuvo hoy y qué decisión tenés que tomar en las próximas horas..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 300))}
              className="min-h-[84px] resize-none rounded-xl bg-secondary/40 border-border text-sm"
              maxLength={300}
            />
            <span className="text-[11px] text-muted-foreground block text-right">
              {message.length}/300
            </span>
          </div>

          {/* Campo 3: Teléfono directo */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-foreground block">
              3. Teléfono directo para contacto de guardia
            </label>
            <Input
              type="tel"
              placeholder="Ej: +54 9 11 5555-5555"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value.slice(0, 40))}
              className="h-11 rounded-xl bg-secondary/40 border-border text-sm"
            />
          </div>

          {/* Botón de Despacho Multicanal */}
          <Button
            onClick={handleEmergency}
            disabled={sending || isOverLimit}
            className="w-full min-h-[52px] gap-2 text-white rounded-xl text-sm sm:text-base font-black tracking-wide shadow-sm transition-transform active:scale-98"
            style={{ backgroundColor: "#E1061E" }}
            size="lg"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
            {sending ? "ACTIVANDO GUARDIA..." : "🚨 ACTIVAR PROTOCOLO DE EMERGENCIA"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Se registra el ticket en Mejora Continua y se abre el canal directo de guardia con Pablo Eckert.
          </p>
        </CardContent>
      </Card>

      {/* Historial de tickets de emergencia */}
      <Card className="border-border rounded-2xl shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#1A3D84] dark:text-blue-400" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground">
              Historial de Activaciones de Guardia
            </h3>
          </div>
          {loadingHistory ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
              Sin tickets de emergencia registrados.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "#E1061E" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-relaxed">
                      {record.message || "Activación de guardia sin detalle adicional"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(record.created_at).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {record.whatsapp_sent && (
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          Despachado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
