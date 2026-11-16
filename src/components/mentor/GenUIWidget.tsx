/**
 * GenUIWidget.tsx — Componentes interactivos Generative UI (2026-2027)
 *
 * Renderiza widgets dinámicos emitidos por Gemini 3.8 Flash en el chat con el Mentor:
 * - discount_calculator: simulador táctico de impacto en margen y volumen necesario
 * - whatsapp_script: plantilla de negociación con 1-click a WhatsApp y copiado
 * - action_checklist: plan táctico de 72 horas con checkboxes interactivos y progreso
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calculator,
  MessageCircle,
  CheckSquare,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export type GenUIWidgetType = "discount_calculator" | "whatsapp_script" | "action_checklist";

export interface GenUIWidgetData {
  type: GenUIWidgetType;
  data: Record<string, unknown>;
}

// ── 1. Discount Calculator Widget ──────────────────────────────────

interface DiscountCalcProps {
  currentMargin?: number;
  proposedDiscount?: number;
  volumeNeeded?: number;
}

function DiscountCalculatorWidget({ data }: { data: DiscountCalcProps }) {
  const [margin, setMargin] = useState<number>(data.currentMargin ?? 35);
  const [discount, setDiscount] = useState<number>(data.proposedDiscount ?? 10);

  // Fórmula económica: % Aumento de volumen necesario = Descuento / (Margen - Descuento)
  const marginAfterDiscount = Math.max(margin - discount, 0);
  const calculatedVolume =
    marginAfterDiscount > 0 ? (discount / marginAfterDiscount) * 100 : 999;

  return (
    <Card className="border-2 border-[#1A3D84]/30 bg-card rounded-2xl shadow-sm overflow-hidden my-3">
      <div className="bg-[#1A3D84] text-white px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-[#F7CC13]" />
          Simulador Táctico de Margen
        </span>
        <span className="text-[10px] font-bold bg-[#F7CC13] text-[#1A1A1A] px-2 py-0.5 rounded-full">
          Criterio Medular
        </span>
      </div>
      <CardContent className="p-4 space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground block">
              Margen bruto actual (%)
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="h-9 text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground block">
              Descuento solicitado (%)
            </label>
            <Input
              type="number"
              min={0}
              max={99}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="h-9 text-xs font-bold text-[#E1061E]"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              Volumen adicional que debés vender para no perder dinero:
            </span>
            <span
              className="text-base font-black px-2 py-0.5 rounded-lg"
              style={{
                color: calculatedVolume > 40 ? "#E1061E" : "#1A3D84",
                backgroundColor: calculatedVolume > 40 ? "rgba(225, 6, 30, 0.1)" : "rgba(26, 61, 132, 0.1)",
              }}
            >
              +{calculatedVolume > 900 ? "∞" : calculatedVolume.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {calculatedVolume > 30
              ? "⚠️ Alerta de caja: Este descuento exige un esfuerzo comercial desproporcionado. Mejor negociar plazos, entregas parciales o valor agregado."
              : "Verificá que tu capacidad instalada y capital de trabajo toleren este incremento de volumen."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── 2. WhatsApp Script Widget ──────────────────────────────────────

interface WhatsAppScriptProps {
  title?: string;
  scriptText?: string;
  recipientRole?: string;
}

function WhatsAppScriptWidget({ data }: { data: WhatsAppScriptProps }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const script =
    data.scriptText ||
    "Hola, revisé tu propuesta. Para mantener la calidad y el estándar de entrega, podemos avanzar con el plan acordado respetando los términos de pago.";

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast({ title: "Guion copiado", description: "Listo para pegar en WhatsApp o correo." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(script)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden my-3">
      <div className="bg-secondary/70 border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          {data.title || "Guion Táctico de Negociación"}
        </span>
        {data.recipientRole && (
          <Badge variant="outline" className="text-[10px] font-bold">
            {data.recipientRole}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="bg-muted/40 p-3 rounded-xl border border-border text-xs leading-relaxed font-sans text-foreground whitespace-pre-wrap">
          {script}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex-1 text-xs font-bold gap-1.5 rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado" : "Copiar texto"}
          </Button>
          <Button
            size="sm"
            onClick={handleOpenWhatsApp}
            className="flex-1 text-xs font-bold gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Enviar por WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── 3. Action Checklist Widget ─────────────────────────────────────

interface ChecklistItem {
  id: string;
  text: string;
  timeframe?: "24h" | "48h" | "72h";
}

interface ActionChecklistProps {
  title?: string;
  items?: ChecklistItem[];
}

function ActionChecklistWidget({ data }: { data: ActionChecklistProps }) {
  const defaultItems: ChecklistItem[] = data.items || [
    { id: "1", text: "Frenar cotización fuera de tabla de costos", timeframe: "24h" },
    { id: "2", text: "Reunión de alineación de 15 minutos con ventas", timeframe: "48h" },
    { id: "3", text: "Monitorear saldo de caja proyectado a viernes", timeframe: "72h" },
  ];

  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const totalCount = defaultItems.length;

  return (
    <Card className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden my-3">
      <div className="bg-secondary/70 border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-[#1A3D84] dark:text-blue-400" />
          {data.title || "Plan Táctico de Ejecución (72 Horas)"}
        </span>
        <span className="text-[10px] font-extrabold text-muted-foreground">
          {doneCount}/{totalCount} acciones
        </span>
      </div>
      <CardContent className="p-4 space-y-2.5">
        {defaultItems.map((item) => {
          const isDone = !!completed[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                  : "bg-secondary/40 border-border hover:border-[#1A3D84]/40"
              }`}
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                  isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-muted-foreground bg-card"
                }`}
              >
                {isDone && <Check className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${isDone ? "line-through text-muted-foreground" : "font-medium text-foreground"}`}>
                  {item.text}
                </p>
              </div>
              {item.timeframe && (
                <Badge
                  variant="secondary"
                  className={`text-[9px] font-extrabold uppercase shrink-0 ${
                    item.timeframe === "24h"
                      ? "text-[#E1061E] bg-[#E1061E]/10"
                      : item.timeframe === "48h"
                      ? "text-[#B48600] bg-[#F7CC13]/15"
                      : "text-[#1A3D84] bg-[#1A3D84]/10 dark:text-blue-400"
                  }`}
                >
                  {item.timeframe}
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ── Widget Parser & Dispatcher ────────────────────────────────────

export function parseGenUIWidgets(rawText: string): { cleanText: string; widgets: GenUIWidgetData[] } {
  const widgetRegex = /<<<WIDGET_JSON\s*([\s\S]*?)\s*WIDGET_JSON>>>/g;
  const widgets: GenUIWidgetData[] = [];

  let match;
  while ((match = widgetRegex.exec(rawText)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed?.type) {
        widgets.push(parsed as GenUIWidgetData);
      }
    } catch (e) {
      console.warn("Failed to parse GenUI widget JSON block:", e);
    }
  }

  const cleanText = rawText.replace(widgetRegex, "").trim();
  return { cleanText, widgets };
}

export function GenUIWidgetRenderer({ widget }: { widget: GenUIWidgetData }) {
  switch (widget.type) {
    case "discount_calculator":
      return <DiscountCalculatorWidget data={widget.data as DiscountCalcProps} />;
    case "whatsapp_script":
      return <WhatsAppScriptWidget data={widget.data as WhatsAppScriptProps} />;
    case "action_checklist":
      return <ActionChecklistWidget data={widget.data as ActionChecklistProps} />;
    default:
      return null;
  }
}
