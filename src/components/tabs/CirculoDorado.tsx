/**
 * CirculoDorado — P07: Círculo Dorado y Mesa de Alianzas B2B (N2)
 *
 * N0/N1: ContentGate con preview borrosa 80/10/5/5
 * N2: Mesa de Alianzas B2B interactiva (publicación de oferta/demanda estratégica,
 *     filtros por tipo de alianza, contacto bilateral mediado y acceso a Emergencia < 60 min SLA).
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useMembership } from "@/hooks/useMembership";
import { useAuth } from "@/contexts/AuthContext";
import { ContentGate } from "@/components/ContentGate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Crown,
  Users,
  AlertTriangle,
  BookOpen,
  MessageCircle,
  Calendar,
  Handshake,
  Search,
  Plus,
  Check,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WA_NUMBER } from "@/data/diagnosticData";
import { allianceOpportunitySchema, formatZodError } from "@/lib/validation";
import { isAllowed } from "@/lib/rateLimit";

interface AllianceMember {
  id: string;
  user_id?: string;
  nombre: string | null;
  apellido?: string | null;
  display_name?: string | null;
  empresa: string | null;
  sector: string | null;
  empresa_tamano?: string | null;
  ofrece?: string | null;
  busca?: string | null;
}

const ALLIANCE_AXES = [
  "Todas",
  "Distribución",
  "Capacidad Instalada",
  "Inversión Conjunta",
  "Proveedores B2B",
] as const;

type AllianceAxis = (typeof ALLIANCE_AXES)[number];

function useMesaDeAlianzas() {
  const [members, setMembers] = useState<AllianceMember[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    supabase
      .from("profiles")
      .select("id, user_id, nombre, apellido, display_name, empresa, sector, empresa_tamano, ofrece, busca")
      .eq("visible_en_red", true)
      .order("created_at", { ascending: false })
      .limit(24)
      .then(({ data }) => {
        setMembers((data ?? []) as AllianceMember[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { members, loading, reload };
}

// ── Preview borrosa 80/10/5/5 ─────────────────────────────────────

function CirculoPreview() {
  return (
    <div className="space-y-4 p-4">
      <div className="bg-card border-2 border-[#F7CC13] rounded-2xl p-5 text-center space-y-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: "rgba(247, 204, 19, 0.2)" }}
        >
          <Crown className="w-6 h-6 text-[#B48600]" />
        </div>
        <h2 className="text-xl font-black text-foreground">Círculo Dorado · Mesa B2B</h2>
        <p className="text-xs text-muted-foreground">
          Directorio C-Level, acuerdos de distribución y protocolo de crisis
        </p>
      </div>
      <div className="space-y-3">
        {[
          "Mesa de Alianzas B2B",
          "Botón de Emergencia (< 60 min SLA)",
          "Silla de la Verdad 1-a-1",
          "Directorio C-Level Verificado",
        ].map((item) => (
          <div
            key={item}
            className="h-16 rounded-2xl bg-card border border-border p-4 flex items-center justify-between"
          >
            <span className="text-sm font-bold text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Vista VIP N2 ──────────────────────────────────────────────────

const VIP_FEATURES = [
  {
    id: "silla",
    title: "Silla de la Verdad (1-a-1)",
    description:
      "Auditoría estratégica directa con Pablo Eckert para destrabar decisiones estructurales de dirección.",
    icon: MessageCircle,
    cta: "Solicitar Silla 1-a-1",
  },
  {
    id: "reuniones",
    title: "Mesa Chica Mensual N2",
    description:
      "Encuentro cerrado de dueños y CEOs bajo protocolo de confidencialidad y Criterio Medular.",
    icon: Calendar,
    cta: "Reservar lugar en Mesa",
  },
  {
    id: "contenido",
    title: "Frameworks de Dirección VIP",
    description:
      "Matrices de acuerdos societarios, tableros de comando y protocolos operativos listos para implementar.",
    icon: BookOpen,
    cta: "Solicitar acceso",
  },
];

function VipView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { members: allianceMembers, loading: allianceLoading, reload } = useMesaDeAlianzas();

  const [selectedAxis, setSelectedAxis] = useState<AllianceAxis>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [axisTag, setAxisTag] = useState<Exclude<AllianceAxis, "Todas">>("Distribución");
  const [ofreceInput, setOfreceInput] = useState("");
  const [buscaInput, setBuscaInput] = useState("");
  const [savingAlliance, setSavingAlliance] = useState(false);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allianceMembers.filter((m) => {
      const textBlob = `${m.nombre ?? ""} ${m.apellido ?? ""} ${m.display_name ?? ""} ${
        m.empresa ?? ""
      } ${m.sector ?? ""} ${m.ofrece ?? ""} ${m.busca ?? ""}`.toLowerCase();

      if (q && !textBlob.includes(q)) return false;
      if (selectedAxis !== "Todas") {
        const axisKeyword = selectedAxis.split(" ")[0].toLowerCase();
        if (!textBlob.includes(axisKeyword)) return false;
      }
      return true;
    });
  }, [allianceMembers, searchQuery, selectedAxis]);

  const handleWhatsApp = (title: string) => {
    const text = encodeURIComponent(
      `Hola! Soy miembro del Círculo Dorado (N2) y quiero coordinar mi acceso a "${title}".`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleConnectMember = (member: AllianceMember) => {
    const targetName =
      member.display_name ||
      `${member.nombre ?? ""} ${member.apellido ?? ""}`.trim() ||
      "Miembro N2";
    const companyInfo = member.empresa ? ` (${member.empresa})` : "";
    const text = encodeURIComponent(
      `Hola! Soy miembro del Círculo Dorado (N2) y solicito conexión bilateral mediada en la Mesa de Alianzas con ${targetName}${companyInfo}.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleNavigateEmergencia = () => {
    window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "emergencia" }));
  };

  const handlePublishAlliance = async () => {
    if (!user) return;

    const parsed = allianceOpportunitySchema.safeParse({
      axis: axisTag,
      ofrece: ofreceInput,
      busca: buscaInput,
    });
    if (!parsed.success) {
      toast({
        title: "Revisá tu propuesta B2B",
        description: formatZodError(parsed.error),
        variant: "destructive",
      });
      return;
    }

    if (!isAllowed("alliance_publish")) {
      toast({
        title: "Demasiadas actualizaciones seguidas",
        description: "Esperá unos minutos antes de volver a editar tu publicación en la Mesa.",
        variant: "destructive",
      });
      return;
    }

    setSavingAlliance(true);
    try {
      const formattedOfrece = parsed.data.ofrece
        ? `[${parsed.data.axis}] ${parsed.data.ofrece}`.slice(0, 300)
        : null;
      const formattedBusca = parsed.data.busca
        ? `[${parsed.data.axis}] ${parsed.data.busca}`.slice(0, 300)
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          ofrece: formattedOfrece,
          busca: formattedBusca,
          visible_en_red: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Alianza publicada en la Mesa",
        description: "Tu propuesta B2B ya está visible para los decisores del Círculo Dorado.",
      });
      setShowPublishForm(false);
      reload();
    } catch (err) {
      console.error("Error updating alliance:", err);
      toast({
        title: "No se pudo guardar",
        description: "Intentá nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSavingAlliance(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Cabecera Bento Círculo Dorado */}
      <div
        className="rounded-2xl p-5 sm:p-6 text-white shadow-md space-y-2 border-b-4"
        style={{ backgroundColor: "#1A3D84", borderBottomColor: "#F7CC13" }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
            style={{ backgroundColor: "#F7CC13", color: "#1A1A1A" }}
          >
            <Crown className="w-3.5 h-3.5" />
            Círculo Dorado · Nivel 2 VIP
          </span>
          <span className="text-[11px] font-bold text-white/80">
            Indispensabilidad Estratégica
          </span>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
          Mesa de Alianzas B2B y Respaldo Directo
        </h1>
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
          Conectá capacidad instalada, distribución e inversión conjunta con decisores verificados bajo el estándar de Mejora Continua.
        </p>
      </div>

      {/* Acceso Rápido al Protocolo de Emergencia (< 60 min SLA) */}
      <div
        className="bg-card rounded-2xl p-4 sm:p-5 border-2 shadow-sm flex items-center justify-between gap-4"
        style={{ borderColor: "#E1061E" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: "rgba(225, 6, 30, 0.1)" }}
          >
            <AlertTriangle className="w-5 h-5 text-[#E1061E]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1061E] block">
              Prioridad N2 · SLA &lt; 60 minutos
            </span>
            <p className="text-sm font-black text-foreground">
              Protocolo de Emergencia Empresarial
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ¿Crisis societaria, financiera u operativa hoy? Activá la guardia directa.
            </p>
          </div>
        </div>
        <button
          onClick={handleNavigateEmergencia}
          className="text-xs font-extrabold px-3.5 py-2.5 rounded-xl text-white shrink-0 transition-opacity hover:opacity-90 flex items-center gap-1.5"
          style={{ backgroundColor: "#E1061E", minHeight: 44 }}
        >
          <span>Abrir Guardia</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sección: Mesa de Alianzas B2B */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" />
              Articulación Comercial C-Level
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground mt-0.5">
              Mesa de Alianzas Estratégicas
            </h2>
          </div>
          <Button
            size="sm"
            onClick={() => setShowPublishForm(!showPublishForm)}
            className="rounded-xl font-bold text-xs gap-1.5 text-white min-h-[40px]"
            style={{ backgroundColor: "#1A3D84" }}
          >
            <Plus className="w-3.5 h-3.5" />
            {showPublishForm ? "Cerrar" : "Postular Alianza"}
          </Button>
        </div>

        {/* Formulario desplegable para publicar oferta/búsqueda en la Mesa */}
        {showPublishForm && (
          <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mr-1">
                Tipo de alianza:
              </span>
              {ALLIANCE_AXES.filter((a) => a !== "Todas").map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => setAxisTag(axis as Exclude<AllianceAxis, "Todas">)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                    axisTag === axis
                      ? "bg-[#1A3D84] text-white border-[#1A3D84]"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {axis}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                ¿Qué capacidad, estructura o activo aportás a la alianza?
              </label>
              <Textarea
                value={ofreceInput}
                onChange={(e) => setOfreceInput(e.target.value.slice(0, 260))}
                placeholder="Ej: Red de distribución nacional en canal ferretero con logística propia..."
                className="min-h-[64px] text-xs bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                ¿Qué contraparte o acuerdo estás buscando?
              </label>
              <Textarea
                value={buscaInput}
                onChange={(e) => setBuscaInput(e.target.value.slice(0, 260))}
                placeholder="Ej: Fabricantes nacionales con capacidad ociosa para marca conjunta..."
                className="min-h-[64px] text-xs bg-card"
              />
            </div>

            <Button
              onClick={handlePublishAlliance}
              disabled={savingAlliance || (!ofreceInput.trim() && !buscaInput.trim())}
              className="w-full min-h-[44px] rounded-xl font-extrabold text-xs text-white gap-2"
              style={{ backgroundColor: "#1A3D84" }}
            >
              {savingAlliance ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Publicar oportunidad en la Mesa B2B
            </Button>
          </div>
        )}

        {/* Buscador y Filtros de Eje B2B */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por empresa, rubro, capacidad ofrecida o buscada..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1A3D84]/30"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {ALLIANCE_AXES.map((axis) => {
              const active = selectedAxis === axis;
              return (
                <button
                  key={axis}
                  type="button"
                  onClick={() => setSelectedAxis(axis)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                    active
                      ? "bg-[#1A3D84] text-white"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {axis}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listado Bento de Decisores */}
        {allianceLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse bg-secondary/60 border border-border"
              />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl p-6 text-center bg-secondary/30 border border-dashed border-border space-y-2">
            <Users className="w-7 h-7 text-muted-foreground mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-foreground">
              Sin coincidencias para este filtro en la Mesa
            </p>
            <p className="text-xs text-muted-foreground">
              Publicá tu oportunidad arriba para que otros directores puedan articular con tu empresa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMembers.map((member) => {
              const fullName =
                member.display_name ||
                `${member.nombre ?? ""} ${member.apellido ?? ""}`.trim() ||
                "Decisor C-Level";
              const initials =
                fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0] ?? "")
                  .join("")
                  .toUpperCase() || "MC";

              return (
                <div
                  key={member.id}
                  className="rounded-xl p-3.5 bg-secondary/30 border border-border hover:border-[#1A3D84]/40 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{ backgroundColor: "#1A3D84" }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-extrabold text-foreground block truncate">
                          {fullName}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {[member.empresa, member.sector].filter(Boolean).join(" · ") ||
                            "Miembro Verificado"}
                        </span>
                      </div>
                    </div>

                    {(member.ofrece || member.busca) && (
                      <div className="space-y-1 pt-1 border-t border-border/60 text-[11px]">
                        {member.ofrece && (
                          <p className="text-foreground line-clamp-2">
                            <strong className="text-[#1A3D84] dark:text-blue-400">Aporta:</strong>{" "}
                            {member.ofrece}
                          </p>
                        )}
                        {member.busca && (
                          <p className="text-foreground line-clamp-2">
                            <strong className="text-[#B48600]">Busca:</strong> {member.busca}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConnectMember(member)}
                    className="w-full min-h-[38px] rounded-lg text-[11px] font-extrabold border border-[#1A3D84]/30 text-[#1A3D84] dark:text-blue-400 hover:bg-[#1A3D84]/10 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Solicitar Conexión Bilateral</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pilares Exclusivos del Círculo Dorado */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground px-1">
          Instancias Exclusivas de Dirección N2
        </h2>
        {VIP_FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3.5"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(247, 204, 19, 0.2)" }}
              >
                <Icon className="w-5 h-5 text-[#B48600]" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1A3D84] dark:text-blue-400 shrink-0" />
                  <h3 className="text-sm font-black text-foreground">{feat.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
                <button
                  onClick={() => handleWhatsApp(feat.title)}
                  className="pt-1 text-xs font-extrabold text-[#1A3D84] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  style={{ minHeight: 40 }}
                >
                  <span>{feat.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────

export default function CirculoDorado() {
  const { isN2 } = useMembership();

  return (
    <ContentGate requiredLevel="n2" preview={<CirculoPreview />}>
      {isN2 ? <VipView /> : null}
    </ContentGate>
  );
}
