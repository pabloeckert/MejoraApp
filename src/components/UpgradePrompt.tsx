/**
 * UpgradePrompt — Prompt para subir de nivel de membresía
 *
 * Muestra CTA para upgrade con info del nivel requerido.
 * Intenta abrir checkout de Tiendup; fallback a WhatsApp.
 */

import { useState } from "react";
import { Lock, Crown, Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openCheckout } from "@/services/tiendup.service";
import type { AccessLevel } from "@/hooks/useAccessLevel";
import { WA_NUMBER } from "@/data/diagnosticData";

interface UpgradePromptProps {
  currentLevel: AccessLevel;
  requiredLevel: AccessLevel;
  message?: string;
}

const LEVEL_INFO: Record<
  AccessLevel,
  { label: string; icon: typeof Lock; color: string; productEnvKey?: string; urlEnvKey?: string }
> = {
  N0: { label: "Free", icon: Lock, color: "text-muted-foreground" },
  N1: { label: "Miembro", icon: Star, color: "text-primary", productEnvKey: "VITE_TIENDUP_PRODUCT_N1", urlEnvKey: "VITE_TIENDUP_N1_URL" },
  N2: { label: "Círculo Dorado", icon: Crown, color: "text-amber-500", productEnvKey: "VITE_TIENDUP_PRODUCT_N2", urlEnvKey: "VITE_TIENDUP_N2_URL" },
  ADMIN: { label: "Admin", icon: Crown, color: "text-red-500" },
};

export function UpgradePrompt({ currentLevel, requiredLevel, message }: UpgradePromptProps) {
  const info = LEVEL_INFO[requiredLevel];
  const Icon = info.icon;
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    // 1. Try direct URL if configured
    const directUrl = info.urlEnvKey ? import.meta.env[info.urlEnvKey] : undefined;
    if (directUrl) {
      window.open(directUrl, "_blank");
      return;
    }

    // 2. Try Tiendup API checkout with product ID
    const productId = info.productEnvKey ? import.meta.env[info.productEnvKey] : undefined;

    if (productId) {
      setLoading(true);
      try {
        await openCheckout(productId);
        return;
      } catch (err) {
        console.warn("[UpgradePrompt] Tiendup checkout failed, falling back to WhatsApp:", err);
      } finally {
        setLoading(false);
      }
    }

    // 3. Fallback: WhatsApp using target number
    const text = encodeURIComponent(
      `¡Hola! Quiero hacer el upgrade a ${info.label} (${requiredLevel}). Mi nivel actual es ${currentLevel}.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center gap-4 py-8 px-6 text-center">
        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${info.color}`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-lg">
            Contenido {info.label}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {message ?? `Necesitás nivel ${info.label} (${requiredLevel}) para acceder a esta sección.`}
          </p>
        </div>

        <Button onClick={handleUpgrade} className="gap-2" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Upgrade a {info.label}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Tu nivel actual: <span className="font-medium">{LEVEL_INFO[currentLevel].label}</span>
        </p>
      </CardContent>
    </Card>
  );
}
