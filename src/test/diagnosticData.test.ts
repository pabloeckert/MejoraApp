import { describe, it, expect } from "vitest";
import {
  shuffle,
  detectarPerfil,
  calcularScores,
  requierePosicion,
  PERFILES,
  BANCO_PREGUNTAS,
  type PerfilKey,
} from "../data/diagnosticData";

describe("shuffle", () => {
  it("should return same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should not mutate original array", () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    shuffle(input);
    expect(input).toEqual(original);
  });

  it("should handle empty array", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("should handle single element", () => {
    expect(shuffle([42])).toEqual([42]);
  });
});

describe("detectarPerfil y Scoring 4D canónico", () => {
  it("should return a valid profile key", () => {
    const validKeys = Object.keys(PERFILES);
    const answer = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3 };
    const result = detectarPerfil(answer);
    expect(validKeys).toContain(result);
  });

  it("detecta ESCEPTICO cuando puntajes son altos y parejos", () => {
    const scores = { personal: 82, organizacional: 80, comercial: 78, empresarial: 85 };
    expect(requierePosicion(scores)).toBe(false);
    expect(detectarPerfil(scores)).toBe("ESCEPTICO");
  });

  it("detecta SIN_PROFESIONALIZAR_LA_EMPRESA cuando puntajes son bajos y parejos", () => {
    const scores = { personal: 32, organizacional: 35, comercial: 30, empresarial: 34 };
    expect(requierePosicion(scores)).toBe(false);
    expect(detectarPerfil(scores)).toBe("SIN_PROFESIONALIZAR_LA_EMPRESA");
  });

  it("detecta SATURADO cuando empresarial y personal son las más débiles", () => {
    const scores = { personal: 20, organizacional: 60, comercial: 60, empresarial: 15 };
    expect(detectarPerfil(scores)).toBe("SATURADO");
  });

  it("detecta EQUIPO_DESALINEADO cuando organizacional y personal son las más débiles", () => {
    const scores = { personal: 25, organizacional: 18, comercial: 70, empresarial: 70 };
    expect(detectarPerfil(scores)).toBe("EQUIPO_DESALINEADO");
  });

  it("detecta AREA_COMERCIAL_SIN_RESULTADOS cuando comercial es la dominante más débil", () => {
    const scores = { personal: 60, organizacional: 60, comercial: 15, empresarial: 50 };
    expect(detectarPerfil(scores)).toBe("AREA_COMERCIAL_SIN_RESULTADOS");
  });

  it("requiere pregunta de posición en pares ambiguos y desempata LIDER_QUE_NECESITA_APOYO vs NUEVA_GENERACION", () => {
    const scores = { personal: 25, organizacional: 35, comercial: 75, empresarial: 70 };
    expect(requierePosicion(scores)).toBe(true);
    expect(detectarPerfil(scores, "fundador")).toBe("LIDER_QUE_NECESITA_APOYO");
    expect(detectarPerfil(scores, "heredero")).toBe("NUEVA_GENERACION");
    expect(detectarPerfil(scores, "gerente")).toBe("NUEVA_GENERACION");
  });

  it("desempata AREA_COMERCIAL_SIN_RESULTADOS vs INDEPENDIENTE_EN_CRECIMIENTO según posición", () => {
    const scores = { personal: 25, organizacional: 70, comercial: 30, empresarial: 70 };
    expect(requierePosicion(scores)).toBe(true);
    expect(detectarPerfil(scores, "fundador")).toBe("AREA_COMERCIAL_SIN_RESULTADOS");
    expect(detectarPerfil(scores, "gerente")).toBe("INDEPENDIENTE_EN_CRECIMIENTO");
  });

  it("calcula scores normalizados 25..100 para respuestas mínimas y máximas", () => {
    const min = calcularScores([1, 1, 1, 1, 1, 1, 1, 1]);
    const max = calcularScores([4, 4, 4, 4, 4, 4, 4, 4]);
    expect(min).toEqual({ personal: 25, organizacional: 25, comercial: 25, empresarial: 25 });
    expect(max).toEqual({ personal: 100, organizacional: 100, comercial: 100, empresarial: 100 });
  });

  it("should handle missing answers by defaulting to neutral (2)", () => {
    const answer = { 1: 1, 2: 1 };
    const result = detectarPerfil(answer);
    expect(Object.keys(PERFILES)).toContain(result);
  });

  it("should handle empty answers", () => {
    const result = detectarPerfil({});
    expect(Object.keys(PERFILES)).toContain(result);
  });
});

describe("PERFILES", () => {
  it("should contain the 8 canonical profiles", () => {
    const canonical8: PerfilKey[] = [
      "SATURADO",
      "LIDER_QUE_NECESITA_APOYO",
      "INDEPENDIENTE_EN_CRECIMIENTO",
      "EQUIPO_DESALINEADO",
      "ESCEPTICO",
      "NUEVA_GENERACION",
      "AREA_COMERCIAL_SIN_RESULTADOS",
      "SIN_PROFESIONALIZAR_LA_EMPRESA",
    ];
    for (const key of canonical8) {
      expect(PERFILES[key]).toBeDefined();
    }
  });

  it("each canonical profile should have required fields", () => {
    for (const [, profile] of Object.entries(PERFILES)) {
      expect(profile.color).toBeTruthy();
      expect(profile.tagline).toBeTruthy();
      expect(profile.desc).toBeTruthy();
      expect(profile.mirror.length).toBeGreaterThan(0);
      expect(profile.symptoms.length).toBeGreaterThan(0);
      expect(profile.ctaTitle).toBeTruthy();
      expect(profile.ctaText).toBeTruthy();
    }
  });
});

describe("BANCO_PREGUNTAS", () => {
  it("should have exactly 8 questions", () => {
    expect(BANCO_PREGUNTAS).toHaveLength(8);
  });

  it("each question should have exactly 4 options", () => {
    for (const q of BANCO_PREGUNTAS) {
      expect(q.opts).toHaveLength(4);
    }
  });

  it("each question should have scores 1, 2, 3, 4", () => {
    for (const q of BANCO_PREGUNTAS) {
      const scores = q.opts.map((o) => o.score).sort();
      expect(scores).toEqual([1, 2, 3, 4]);
    }
  });

  it("each question should have id from 1 to 8", () => {
    const ids = BANCO_PREGUNTAS.map((q) => q.id).sort();
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
