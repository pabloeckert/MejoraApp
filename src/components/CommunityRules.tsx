/**
 * CommunityRules — Pacto Cultural y Reglas del Espacio Seguro en el Muro
 *
 * Se muestra como un bloque Bento desplegable al inicio del muro.
 */

import { useState } from "react";
import { Shield, ChevronDown, ChevronUp, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const rules = [
  {
    icon: Check,
    text: "La crítica va al proceso y a la falta de estructura, jamás a la persona.",
    ok: true,
  },
  {
    icon: Check,
    text: "Verdad sin maquillaje con respeto entre pares: compartí números, dilemas y casos reales.",
    ok: true,
  },
  {
    icon: Check,
    text: "Identidad protegida: acá hablás de lo que no podés hablar con tus empleados ni en tu casa.",
    ok: true,
  },
  {
    icon: AlertTriangle,
    text: "Cero ventas, autopromoción ni captación comercial. Este es un recinto de dirección.",
    ok: false,
  },
  {
    icon: AlertTriangle,
    text: "Sin datos personales ni nombres de terceros (teléfonos, emails o razones sociales).",
    ok: false,
  },
  {
    icon: AlertTriangle,
    text: "Sin juicios morales ni ataques personales. Desarmamos cuellos de botella con método.",
    ok: false,
  },
];

export const CommunityRules = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardContent className="p-3.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1A3D84] dark:text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Pacto Cultural del Muro · Criterio Medular
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2.5 pt-2.5 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              El Muro de Líderes es el espacio confidencial de Mejora Continua. Cada publicación opera bajo seudónimo ejecutivo y moderación IA para proteger el Criterio Medular:
            </p>
            <div className="space-y-1.5">
              {rules.map((rule, i) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2.5 rounded-xl ${
                      rule.ok ? "bg-[#1A3D84]/5" : "bg-[#E1061E]/5"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        rule.ok ? "text-[#1A3D84] dark:text-blue-400" : "text-[#E1061E]"
                      }`}
                    />
                    <span className="text-xs text-foreground leading-snug">
                      {rule.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityRules;
