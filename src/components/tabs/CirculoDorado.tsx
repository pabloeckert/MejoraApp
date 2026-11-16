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
import { Input } from "@/components/ui/input";
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
  Sparkles,
} from "lucide-react";
import { WA_NUMBER } from "@/data/diagnosticData";
import { isAllowed } from "@/lib/rateLimit";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchActiveAlliances,
  createAllianceOpportunity,
  expressAllianceInterest,
  fetchAllianceMatches,
  fetchRequestedAllianceIds,
  AllianceOpportunity,
  AllianceAxis as ServiceAllianceAxis,
} from "@/services/alliances.service";

const ALLIANCE_AXES = [
  "Todas",
  "Distribución",
  "Capacidad Instalada",
  "Inversión Conjunta",
  "Proveedores B2B",
] as const;

type AllianceAxis = (typeof ALLIANCE_AXES)[number];

function useMesaDeAlianzas() {
  const [alliances, setAlliances] = useState<AllianceOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActiveAlliances();
      setAlliances(data);
    } catch (err) {
      console.warn("Error fetching alliances table, falling back to empty:", err);
      setAlliances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { alliances, loading, reload };
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
  const { alliances, loading: allianceLoading, reload } = useMesaDeAlianzas();

  const [selectedAxis, setSelectedAxis] = useState<AllianceAxis>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [axisTag, setAxisTag] = useState<ServiceAllianceAxis>("Distribución");
  const [titleInput, setTitleInput] = useState("");
  const [ofreceInput, setOfreceInput] = useState("");
  const [buscaInput, setBuscaInput] = useState("");
  const [regionInput, setRegionInput] = useState("");
  const [savingAlliance, setSavingAlliance] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [aiMatches, setAiMatches] = useState<Map<string, { score: number; reason: string }>>(new Map());
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Cargar IDs ya solicitados por el usuario
  useEffect(() => {
    if (!user) return;
    fetchRequestedAllianceIds(user.id).then(setRequestedIds);
  }, [user]);

  const filteredAlliances = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return alliances.filter((item) => {
      const textBlob = `${item.title} ${item.ofrece ?? ""} ${item.busca ?? ""} ${item.region ?? ""} ${
        item.author_name ?? ""
      } ${item.author_company ?? ""} ${item.author_sector ?? ""}`.toLowerCase();

      if (q && !textBlob.includes(q)) return false;
      if (selectedAxis !== "Todas" && item.axis !== selectedAxis) return false;
      return true;
    });
  }, [alliances, searchQuery, selectedAxis]);

  const handleWhatsApp = (title: string) => {
    const text = encodeURIComponent(
      `Hola! Soy miembro del Círculo Dorado (N2) y quiero coordinar mi acceso a "${title}".`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleConnectAlliance = async (item: AllianceOpportunity) => {
    if (!user) return;
    setConnectingId(item.id);
    try {
      await expressAllianceInterest({
        allianceId: item.id,
        userId: user.id,
        note: `Interés expresado en alianza [${item.axis}] "${item.title}"`,
      });
      setRequestedIds((prev) => new Set([...prev, item.id]));

      const targetAuthor = item.author_name || "Colega C-Level";
      const companyInfo = item.author_company ? ` (${item.author_company})` : "";
      const text = encodeURIComponent(
        `Hola Pablo! Soy miembro del Círculo Dorado (N2) y solicito articulación bilateral para la alianza "${item.title}" de ${targetAuthor}${companyInfo} [Eje: ${item.axis}].`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
      toast({
        title: "Interés registrado en la Mesa B2B",
        description: "Se abrió el canal de coordinación para la articulación bilateral mediada.",
      });
    } catch (err) {
      console.error("Error expressing interest:", err);
      toast({
        title: "No se pudo registrar el interés",
        description: "Intentá nuevamente o coordiná por WhatsApp directo.",
        variant: "destructive",
      });
    } finally {
      setConnectingId(null);
    }
  };

  const handleRunAiMatching = async () => {
    if (matchingLoading) return;
    setMatchingLoading(true);
    try {
      const suggestions = await fetchAllianceMatches();
      const matchMap = new Map<string, { score: number; reason: string }>();
      for (const s of suggestions) {
        matchMap.set(s.allianceId, { score: s.score, reason: s.reason });
      }
      setAiMatches(matchMap);
      toast({
        title: "Matchmaking IA completado",
        description: `Se detectaron ${suggestions.length} alianzas con alta complementariedad estratégica.`,
      });
    } catch (err) {
      console.warn("Error running AI matches:", err);
      toast({
        title: "Mesa de IA temporalmente no disponible",
        description: "Podés explorar y filtrar las oportunidades manualmente.",
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleNavigateEmergencia = () => {
    window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "emergencia" }));
  };

  const handlePublishAlliance = async () => {
    if (!user) return;

    const finalTitle = titleInput.trim() || `${axisTag}: ${ofreceInput.trim().slice(0, 45)}...`;
    if (!ofreceInput.trim() && !buscaInput.trim()) {
      toast({
        title: "Completá tu propuesta",
        description: "Indicá al menos qué aportás o qué contraparte buscás.",
        variant: "destructive",
      });
      return;
    }

    if (!isAllowed("alliance_publish")) {
      toast({
        title: "Demasiadas actualizaciones seguidas",
        description: "Esperá unos minutos antes de volver a publicar en la Mesa.",
        variant: "destructive",
      });
      return;
    }

    setSavingAlliance(true);
    try {
      await createAllianceOpportunity({
        userId: user.id,
        axis: axisTag,
        title: finalTitle,
        ofrece: ofreceInput.trim() || null,
        busca: buscaInput.trim() || null,
        region: regionInput.trim() || null,
      });

      // Sincronizar campos legados de perfil
      await supabase
        .from("profiles")
        .update({
          ofrece: `[${axisTag}] ${ofreceInput.trim()}`.slice(0, 300),
          busca: `[${axisTag}] ${buscaInput.trim()}`.slice(0, 300),
          visible_en_red: true,
        })
        .eq("user_id", user.id);

      toast({
        title: "Alianza publicada en la Mesa",
        description: "Tu propuesta B2B ya está activa para los decisores del Círculo Dorado.",
      });
      setShowPublishForm(false);
      setTitleInput("");
      setOfreceInput("");
      setBuscaInput("");
      setRegionInput("");
      reload();
    } catch (err) {
      console.error("Error creating alliance:", err);
      toast({
        title: "No se pudo guardar la alianza",
        description: "Revisá tu conexión o intentá nuevamente.",
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
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" />
              Articulación Comercial C-Level
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground mt-0.5">
              Mesa de Alianzas Estratégicas
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunAiMatching}
              disabled={matchingLoading}
              className="rounded-xl font-bold text-xs gap-1.5 border-[#1A3D84]/40 text-[#1A3D84] dark:text-blue-400 min-h-[40px]"
            >
              {matchingLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#F7CC13]" />
              )}
              Matchmaking IA
            </Button>
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
        </div>

        {/* Formulario desplegable para publicar oportunidad en la Mesa */}
        {showPublishForm && (
          <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mr-1">
                Eje estratégico:
              </span>
              {ALLIANCE_AXES.filter((a) => a !== "Todas").map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => setAxisTag(axis as ServiceAllianceAxis)}
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
                Título o síntesis de la oportunidad
              </label>
              <Input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value.slice(0, 100))}
                placeholder="Ej: Distribución logística en NEA para productos masivos..."
                className="h-10 text-xs bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                ¿Qué capacidad, estructura o activo aportás a la alianza?
              </label>
              <Textarea
                value={ofreceInput}
                onChange={(e) => setOfreceInput(e.target.value.slice(0, 260))}
                placeholder="Ej: Flota propia, 1200 puntos de entrega activos, equipo de ventas..."
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
                placeholder="Ej: Fabricantes con marca consolidada que busquen penetración en la región..."
                className="min-h-[64px] text-xs bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                Alcance geográfico / Región
              </label>
              <Input
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value.slice(0, 50))}
                placeholder="Ej: Misiones, Corrientes / Todo el país"
                className="h-10 text-xs bg-card"
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

        {/* Listado Bento de Oportunidades B2B */}
        {allianceLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse bg-secondary/60 border border-border"
              />
            ))}
          </div>
        ) : filteredAlliances.length === 0 ? (
          <div className="rounded-xl p-6 text-center bg-secondary/30 border border-dashed border-border space-y-2">
            <Users className="w-7 h-7 text-muted-foreground mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-foreground">
              Sin alianzas registradas para este filtro en la Mesa
            </p>
            <p className="text-xs text-muted-foreground">
              Publicá tu oportunidad arriba para que otros directores puedan articular con tu empresa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAlliances.map((item) => {
              const fullName = item.author_name || "Decisor C-Level";
              const initials =
                fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0] ?? "")
                  .join("")
                  .toUpperCase() || "MC";

              const matchInfo = aiMatches.get(item.id);
              const alreadyRequested = requestedIds.has(item.id);
              const isOwner = user?.id === item.user_id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl p-3.5 bg-secondary/30 border border-border hover:border-[#1A3D84]/40 transition-colors flex flex-col justify-between gap-3 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
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
                            {[item.author_company, item.author_sector, item.region]
                              .filter(Boolean)
                              .join(" · ") || "Miembro Círculo Dorado"}
                          </span>
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shrink-0"
                        style={{ backgroundColor: "#1A3D84" }}
                      >
                        {item.axis}
                      </span>
                    </div>

                    {matchInfo && (
                      <div className="bg-[#F7CC13]/15 border border-[#F7CC13]/40 rounded-lg p-2 text-[11px] space-y-0.5">
                        <span className="font-extrabold text-[#946c00] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Match Estratégico IA ({Math.round(matchInfo.score * 100)}%)
                        </span>
                        <p className="text-muted-foreground text-[10px] leading-snug">
                          {matchInfo.reason}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-extrabold text-foreground leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    {(item.ofrece || item.busca) && (
                      <div className="space-y-1 pt-1 border-t border-border/60 text-[11px]">
                        {item.ofrece && (
                          <p className="text-foreground line-clamp-2">
                            <strong className="text-[#1A3D84] dark:text-blue-400">Aporta:</strong>{" "}
                            {item.ofrece}
                          </p>
                        )}
                        {item.busca && (
                          <p className="text-foreground line-clamp-2">
                            <strong className="text-[#B48600]">Busca:</strong> {item.busca}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!isOwner ? (
                    <button
                      type="button"
                      disabled={connectingId === item.id}
                      onClick={() => handleConnectAlliance(item)}
                      className={`w-full min-h-[38px] rounded-lg text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1 ${
                        alreadyRequested
                          ? "bg-secondary text-foreground border border-border"
                          : "border border-[#1A3D84]/40 text-[#1A3D84] dark:text-blue-400 hover:bg-[#1A3D84]/10"
                      }`}
                    >
                      {connectingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : alreadyRequested ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Contacto Solicitado (Reabrir WhatsApp)</span>
                        </>
                      ) : (
                        <>
                          <span>Solicitar Articulación Bilateral</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-muted-foreground text-center py-1">
                      Tu oportunidad activa
                    </div>
                  )}
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
