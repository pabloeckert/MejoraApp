// Shared Zod schemas for Edge Function input validation
// Import: import { mentorChatSchema, formatZodError } from "../_shared/schemas.ts";
import { z, ZodError } from "https://esm.sh/zod@3.23.8";

export const mentorChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Mensaje requerido")
    .max(1000, "Mensaje demasiado largo (máx 1000 caracteres)"),
  conversationId: z.string().uuid().optional().nullable(),
});

export const moderatePostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "El contenido no puede estar vacío.")
    .max(1000, "El contenido no puede superar los 1000 caracteres."),
  post_type: z
    .enum(["consulta", "caso", "convocatoria"])
    .optional()
    .default("consulta"),
});

export const moderateCommentSchema = z.object({
  post_id: z
    .string()
    .trim()
    .min(1, "post_id inválido.")
    .max(100, "post_id inválido."),
  content: z
    .string()
    .trim()
    .min(1, "El contenido no puede estar vacío.")
    .max(500, "Máximo 500 caracteres."),
});

export const tiendupEventSchema = z
  .object({
    event: z.string().min(1, "event requerido"),
    data: z
      .object({
        email: z.string().email().optional(),
        subscriber_email: z.string().email().optional(),
        product_id: z.string().optional(),
        product_name: z.string().optional(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        payment_method: z.string().optional(),
        external_id: z.string().optional(),
        subscription_id: z.string().optional(),
      })
      .passthrough(),
  })
  .passthrough();

export const emergencyDispatchSchema = z.object({
  crisisType: z.string().trim().min(2, "Indicá el tipo de crisis.").max(60),
  message: z
    .string()
    .trim()
    .min(10, "Describí brevemente el impacto actual (mín. 10 caracteres).")
    .max(300, "Máximo 300 caracteres."),
  contactPhone: z
    .string()
    .trim()
    .max(40, "Teléfono inválido.")
    .optional()
    .or(z.literal("")),
});

export const syncContactosSchema = z
  .object({
    source: z.string().trim().max(40).optional().default("mejora_app"),
    email: z.string().trim().email("Email inválido.").optional(),
    nombre: z.string().trim().max(120).optional(),
    telefono: z.string().trim().max(40).optional(),
    cargo: z.string().trim().max(100).optional(),
    organizacion: z.string().trim().max(120).optional(),
    persona_id: z.string().trim().max(80).optional(),
    nota_referencia: z.string().trim().max(250).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const allianceMatchSchema = z.object({
  allianceId: z.string().uuid().optional().nullable(),
});

/** Extracts a human-readable message from the first Zod issue. */
export function formatZodError(error: ZodError): string {
  return error.issues[0]?.message ?? "Datos inválidos.";
}
