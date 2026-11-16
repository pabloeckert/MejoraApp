/**
 * tiendup.service.ts — Servicio de integración con Tiendup
 *
 * Provee: crear checkout, verificar suscripción y flujo unificado de upgrade
 * (URL directa → Edge Function tiendup-checkout → Fallback WhatsApp institucional).
 */
import { supabase } from "@/integrations/supabase/client";
import { WA_NUMBER } from "@/data/diagnosticData";

interface CheckoutResult {
  checkout_url: string;
  sale_id: string;
}

export async function createCheckout(productId: string): Promise<CheckoutResult> {
  const { data, error } = await supabase.functions.invoke("tiendup-checkout", {
    body: { product_id: productId },
  });

  if (error) {
    throw new Error(error.message || "Error al crear checkout");
  }

  if (!data?.checkout_url) {
    throw new Error("No se recibió URL de checkout");
  }

  return data as CheckoutResult;
}

export async function openCheckout(productId: string): Promise<void> {
  const result = await createCheckout(productId);
  window.open(result.checkout_url, "_blank", "noopener,noreferrer");
}

/**
 * Ejecuta el flujo unificado de suscripción con degradación resiliente.
 * 1) Link directo Tiendup (VITE_TIENDUP_N1_URL / VITE_TIENDUP_N2_URL)
 * 2) Edge Function tiendup-checkout vía Product ID (VITE_TIENDUP_PRODUCT_N1 / N2)
 * 3) Fallback garantizado a WhatsApp institucional (WA_NUMBER)
 */
export async function startMembershipUpgrade(
  targetLevel: "n1" | "n2",
  currentLevel = "N0"
): Promise<"url" | "checkout" | "whatsapp"> {
  const directUrl =
    targetLevel === "n2"
      ? import.meta.env.VITE_TIENDUP_N2_URL
      : import.meta.env.VITE_TIENDUP_N1_URL;

  if (directUrl) {
    window.open(directUrl, "_blank", "noopener,noreferrer");
    return "url";
  }

  const productId =
    targetLevel === "n2"
      ? import.meta.env.VITE_TIENDUP_PRODUCT_N2
      : import.meta.env.VITE_TIENDUP_PRODUCT_N1;

  if (productId) {
    try {
      await openCheckout(productId);
      return "checkout";
    } catch (err) {
      console.warn("[tiendup.service] Checkout dinámico falló, usando fallback WhatsApp:", err);
    }
  }

  const label = targetLevel === "n2" ? "Círculo Dorado (N2)" : "Miembro de la Red (N1)";
  const text = encodeURIComponent(
    `¡Hola! Quiero activar mi membresía ${label}. Mi nivel actual es ${currentLevel.toUpperCase()}.`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  return "whatsapp";
}
