/**
 * Shared Multi-Provider AI Client for Supabase Edge Functions (2026–2027)
 *
 * Cadena de modelos (sin modelos legacy apagados como gemini-2.0-flash):
 * - Razonamiento estratégico: gemini-3.8-flash (thinkingLevel: HIGH | MEDIUM | LOW)
 * - Clasificación / moderación rápida: gemini-3.5-flash-lite
 * - Fallbacks resilientes: Groq (llama-3.3-70b-versatile) → OpenRouter (deepseek-v3)
 */
import { logWarn } from "./log.ts";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type ThinkingLevel = "LOW" | "MEDIUM" | "HIGH";
export type AIProfile = "reasoning" | "fast";

export interface AIResult {
  content: string;
  model: string;
  tokensUsed: number;
}

export interface AIGenerateOptions {
  profile?: AIProfile;
  thinkingLevel?: ThinkingLevel;
  temperature?: number;
  maxTokens?: number;
  responseMimeType?: "text/plain" | "application/json";
  logTag?: string;
}

export type StreamChunkCallback = (chunk: string) => Promise<void>;

const GEMINI_REASONING_MODEL = "gemini-3.8-flash";
const GEMINI_FAST_MODEL = "gemini-3.5-flash-lite";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";

function normalizeThinkingLevel(level?: string | null): ThinkingLevel {
  const upper = (level ?? "").trim().toUpperCase();
  if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH") {
    return upper;
  }
  return "HIGH";
}

function buildGeminiBody(
  messages: AIMessage[],
  opts: {
    model: string;
    thinkingLevel: ThinkingLevel;
    temperature: number;
    maxTokens: number;
    responseMimeType?: "text/plain" | "application/json";
  }
) {
  const systemText = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n")
    .trim();

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature,
    maxOutputTokens: opts.maxTokens,
  };

  if (opts.responseMimeType) {
    generationConfig.responseMimeType = opts.responseMimeType;
  }

  // gemini-3.8-flash admite LOW | MEDIUM | HIGH (nunca MINIMAL)
  if (opts.model === GEMINI_REASONING_MODEL) {
    generationConfig.thinkingConfig = {
      thinkingLevel: opts.thinkingLevel,
    };
  }

  return {
    ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
    contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: systemText || "Hola" }] }],
    generationConfig,
  };
}

function extractGeminiPartsText(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  let out = "";
  for (const part of parts) {
    if (part && typeof part === "object") {
      const p = part as { text?: string; thought?: boolean };
      if (p.thought === true) continue;
      if (typeof p.text === "string") out += p.text;
    }
  }
  return out;
}

async function callGemini(
  messages: AIMessage[],
  opts: Required<Pick<AIGenerateOptions, "profile" | "thinkingLevel" | "temperature" | "maxTokens" | "logTag">> & {
    responseMimeType?: "text/plain" | "application/json";
  }
): Promise<AIResult | null> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return null;

  const model = opts.profile === "fast" ? GEMINI_FAST_MODEL : GEMINI_REASONING_MODEL;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify(
          buildGeminiBody(messages, {
            model,
            thinkingLevel: opts.thinkingLevel,
            temperature: opts.temperature,
            maxTokens: opts.maxTokens,
            responseMimeType: opts.responseMimeType,
          })
        ),
      }
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      logWarn(opts.logTag, `Gemini ${model} HTTP ${res.status}`, { error: errBody.slice(0, 240) });
      return null;
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts;
    const text = extractGeminiPartsText(parts);
    const tokens = data.usageMetadata?.totalTokenCount ?? 0;

    return text ? { content: text, model, tokensUsed: tokens } : null;
  } catch (e) {
    logWarn(opts.logTag, `Gemini ${model} failed`, { error: String(e) });
    return null;
  }
}

async function callOpenAICompatible(
  endpoint: string,
  apiKeyEnv: string,
  model: string,
  modelLabel: string,
  messages: AIMessage[],
  opts: { temperature: number; maxTokens: number; logTag: string }
): Promise<AIResult | null> {
  const key = Deno.env.get(apiKeyEnv);
  if (!key) return null;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    });

    if (!res.ok) {
      logWarn(opts.logTag, `${modelLabel} HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const tokens = data.usage?.total_tokens ?? 0;

    return text ? { content: text, model: modelLabel, tokensUsed: tokens } : null;
  } catch (e) {
    logWarn(opts.logTag, `${modelLabel} failed`, { error: String(e) });
    return null;
  }
}

export async function generateAIText(
  messages: AIMessage[],
  options: AIGenerateOptions = {}
): Promise<AIResult | null> {
  const resolved = {
    profile: options.profile ?? "reasoning",
    thinkingLevel: normalizeThinkingLevel(options.thinkingLevel),
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 700,
    responseMimeType: options.responseMimeType,
    logTag: options.logTag ?? "ai-client",
  };

  return (
    (await callGemini(messages, resolved)) ??
    (await callOpenAICompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      "GROQ_API_KEY",
      GROQ_MODEL,
      GROQ_MODEL,
      messages,
      resolved
    )) ??
    (await callOpenAICompatible(
      "https://openrouter.ai/api/v1/chat/completions",
      "OPENROUTER_API_KEY",
      OPENROUTER_MODEL,
      "deepseek-v3",
      messages,
      resolved
    ))
  );
}

async function streamGemini(
  messages: AIMessage[],
  onChunk: StreamChunkCallback,
  opts: { thinkingLevel: ThinkingLevel; temperature: number; maxTokens: number; logTag: string }
): Promise<AIResult | null> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_REASONING_MODEL}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify(
          buildGeminiBody(messages, {
            model: GEMINI_REASONING_MODEL,
            thinkingLevel: opts.thinkingLevel,
            temperature: opts.temperature,
            maxTokens: opts.maxTokens,
          })
        ),
      }
    );

    if (!res.ok || !res.body) {
      logWarn(opts.logTag, `Gemini stream HTTP ${res.status}`);
      return null;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";
    let totalTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (!data || data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.usageMetadata?.totalTokenCount) {
            totalTokens = parsed.usageMetadata.totalTokenCount;
          }
          const chunk = extractGeminiPartsText(parsed.candidates?.[0]?.content?.parts);
          if (chunk) {
            fullText += chunk;
            await onChunk(chunk);
          }
        } catch {
          // skip malformed SSE frame
        }
      }
    }

    return fullText
      ? { content: fullText, model: GEMINI_REASONING_MODEL, tokensUsed: totalTokens }
      : null;
  } catch (e) {
    logWarn(opts.logTag, "Gemini stream failed", { error: String(e) });
    return null;
  }
}

async function streamOpenAICompatible(
  endpoint: string,
  apiKeyEnv: string,
  model: string,
  modelLabel: string,
  messages: AIMessage[],
  onChunk: StreamChunkCallback,
  opts: { temperature: number; maxTokens: number; logTag: string }
): Promise<AIResult | null> {
  const key = Deno.env.get(apiKeyEnv);
  if (!key) return null;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) return null;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const chunk = parsed.choices?.[0]?.delta?.content;
          if (chunk) {
            fullText += chunk;
            await onChunk(chunk);
          }
        } catch {
          // skip malformed SSE chunk
        }
      }
    }

    return fullText ? { content: fullText, model: modelLabel, tokensUsed: 0 } : null;
  } catch (e) {
    logWarn(opts.logTag, `${modelLabel} stream failed`, { error: String(e) });
    return null;
  }
}

export async function streamAIText(
  messages: AIMessage[],
  onChunk: StreamChunkCallback,
  options: Omit<AIGenerateOptions, "profile" | "responseMimeType"> = {}
): Promise<AIResult | null> {
  const resolved = {
    thinkingLevel: normalizeThinkingLevel(options.thinkingLevel),
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 900,
    logTag: options.logTag ?? "ai-stream",
  };

  // Orden: Gemini 3.8 Flash (si hay key) → Groq → OpenRouter
  return (
    (await streamGemini(messages, onChunk, resolved)) ??
    (await streamOpenAICompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      "GROQ_API_KEY",
      GROQ_MODEL,
      GROQ_MODEL,
      messages,
      onChunk,
      resolved
    )) ??
    (await streamOpenAICompatible(
      "https://openrouter.ai/api/v1/chat/completions",
      "OPENROUTER_API_KEY",
      OPENROUTER_MODEL,
      "deepseek-v3",
      messages,
      onChunk,
      resolved
    ))
  );
}
