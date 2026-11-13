/**
 * Validation Tests
 *
 * Tests for zod validation schemas.
 */

import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  profileEditSchema,
  wallPostSchema,
  wallCommentSchema,
  contentPostSchema,
  emergencyAlertSchema,
  allianceOpportunitySchema,
  formatZodError,
  validateOrThrow,
} from "@/lib/validation";

// ── Login Schema ────────────────────────────────────────────────
describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "123456" });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "123456" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123456" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

// ── Signup Schema ───────────────────────────────────────────────
describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@example.com",
      password: "Password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects nombre with numbers", () => {
    const result = signupSchema.safeParse({
      nombre: "Juan123",
      apellido: "Pérez",
      email: "juan@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts nombre with accents", () => {
    const result = signupSchema.safeParse({
      nombre: "José María",
      apellido: "García López",
      email: "jose@example.com",
      password: "Password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty fields", () => {
    const result = signupSchema.safeParse({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

// ── Reset Password Schema ───────────────────────────────────────
describe("resetPasswordSchema", () => {
  it("accepts valid email", () => {
    const result = resetPasswordSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = resetPasswordSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });
});

// ── Profile Edit Schema ─────────────────────────────────────────
describe("profileEditSchema", () => {
  it("accepts valid profile data", () => {
    const result = profileEditSchema.safeParse({
      bio: "Emprendedor apasionado",
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/test",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty optional fields", () => {
    const result = profileEditSchema.safeParse({
      bio: "",
      website: "",
      linkedin: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bio over 500 chars", () => {
    const result = profileEditSchema.safeParse({ bio: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL", () => {
    const result = profileEditSchema.safeParse({ website: "not-a-url" });
    expect(result.success).toBe(false);
  });
});

// ── Wall Post Schema ────────────────────────────────────────────
describe("wallPostSchema", () => {
  it("accepts valid post content", () => {
    const result = wallPostSchema.safeParse({ content: "Mi negocio está creciendo" });
    expect(result.success).toBe(true);
  });

  it("strips HTML tags", () => {
    const result = wallPostSchema.safeParse({ content: "<p>Hola</p> <b>mundo</b>" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("Hola mundo");
    }
  });

  it("strips dangerous tags and content", () => {
    const result = wallPostSchema.safeParse({ content: "<script>alert('xss')</script>safe" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("safe");
    }
  });

  it("rejects empty content", () => {
    const result = wallPostSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects content over 500 chars", () => {
    const result = wallPostSchema.safeParse({ content: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("accepts content at exactly 500 chars", () => {
    const result = wallPostSchema.safeParse({ content: "a".repeat(500) });
    expect(result.success).toBe(true);
  });
});

// ── Wall Comment Schema ─────────────────────────────────────────
describe("wallCommentSchema", () => {
  it("accepts valid comment", () => {
    const result = wallCommentSchema.safeParse({ content: "Buen post!" });
    expect(result.success).toBe(true);
  });

  it("rejects empty comment", () => {
    const result = wallCommentSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects comment over 300 chars", () => {
    const result = wallCommentSchema.safeParse({ content: "a".repeat(301) });
    expect(result.success).toBe(false);
  });

  it("strips HTML from comments", () => {
    const result = wallCommentSchema.safeParse({ content: "<script>alert('xss')</script>safe" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("safe");
    }
  });
});

// ── Content Post Schema ─────────────────────────────────────────
describe("contentPostSchema", () => {
  it("accepts valid content post", () => {
    const result = contentPostSchema.safeParse({
      titulo: "Cómo crecer tu negocio",
      resumen: "Tips para emprendedores",
      contenido: "Contenido completo del artículo...",
      tipo_media: "articulo",
      categoria_id: "cat-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing titulo", () => {
    const result = contentPostSchema.safeParse({
      titulo: "",
      contenido: "algo",
      tipo_media: "articulo",
      categoria_id: "cat-123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid tipo_media", () => {
    const result = contentPostSchema.safeParse({
      titulo: "Test",
      contenido: "algo",
      tipo_media: "podcast",
      categoria_id: "cat-123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid media types", () => {
    for (const tipo of ["articulo", "video", "infografia", "pdf"]) {
      const result = contentPostSchema.safeParse({
        titulo: "Test",
        contenido: "algo",
        tipo_media: tipo,
        categoria_id: "cat-123",
      });
      expect(result.success).toBe(true);
    }
  });
});

// ── Utility Functions ───────────────────────────────────────────
describe("formatZodError", () => {
  it("formats single error", () => {
    const result = loginSchema.safeParse({ email: "", password: "123" });
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    }
  });

  it("formats multiple errors", () => {
    const result = signupSchema.safeParse({
      nombre: "",
      apellido: "",
      email: "invalid",
      password: "12",
    });
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain(".");
    }
  });
});

describe("validateOrThrow", () => {
  it("returns data on success", () => {
    const data = validateOrThrow(loginSchema, {
      email: "test@example.com",
      password: "123456",
    });
    expect(data.email).toBe("test@example.com");
  });

  it("throws on failure", () => {
    expect(() => {
      validateOrThrow(loginSchema, { email: "", password: "" });
    }).toThrow();
  });
});

// ── Sprint 3: Emergency Alert Schema ─────────────────────────────
describe("emergencyAlertSchema", () => {
  it("accepts valid crisis payload", () => {
    const result = emergencyAlertSchema.safeParse({
      crisisType: "Caja / Financiera",
      message: "Se frenó la cobranza clave de esta semana.",
      contactPhone: "+54 9 11 5555-5555",
    });
    expect(result.success).toBe(true);
  });

  it("strips HTML and XSS tags from message and phone", () => {
    const result = emergencyAlertSchema.safeParse({
      crisisType: "Conflicto Societario",
      message: "<script>alert('xss')</script>Urgencia real",
      contactPhone: "<b>+5491155555555</b>",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Urgencia real");
      expect(result.data.contactPhone).toBe("+5491155555555");
    }
  });

  it("rejects message exceeding 600 chars", () => {
    const result = emergencyAlertSchema.safeParse({
      crisisType: "Operación Detenida",
      message: "a".repeat(601),
      contactPhone: "",
    });
    expect(result.success).toBe(false);
  });
});

// ── Sprint 3: Alliance Opportunity Schema ────────────────────────
describe("allianceOpportunitySchema", () => {
  it("accepts valid B2B alliance payload", () => {
    const result = allianceOpportunitySchema.safeParse({
      axis: "Distribución",
      ofrece: "Logística nacional",
      busca: "Proveedores industriales",
    });
    expect(result.success).toBe(true);
  });

  it("strips HTML tags cleanly", () => {
    const result = allianceOpportunitySchema.safeParse({
      axis: "Capacidad Instalada",
      ofrece: "<img src=x onerror=alert(1)>Planta disponible",
      busca: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ofrece).toBe("Planta disponible");
    }
  });

  it("rejects when both ofrece and busca are empty after sanitization", () => {
    const result = allianceOpportunitySchema.safeParse({
      axis: "Inversión Conjunta",
      ofrece: "<script>alert(1)</script>",
      busca: "   ",
    });
    expect(result.success).toBe(false);
  });
});
