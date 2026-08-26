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

/** Extracts a human-readable message from the first Zod issue. */
export function formatZodError(error: ZodError): string {
  return error.issues[0]?.message ?? "Datos inválidos.";
}
