/**
 * offlineQueue.ts — Outbox de sincronización offline para PWA (2026-2027)
 *
 * Almacena acciones críticas (diagnósticos completados, respuestas offline)
 * en localStorage y las despacha automáticamente al recuperar conectividad.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface QueuedAction {
  id: string;
  type: "save_diagnostic" | "wall_post";
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

const QUEUE_STORAGE_KEY = "mc_offline_outbox_v1";
const MAX_RETRIES = 5;

export function getOfflineQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: QueuedAction[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Could not save offline queue:", err);
  }
}

export function enqueueOfflineAction(
  type: QueuedAction["type"],
  payload: Record<string, unknown>
): void {
  const queue = getOfflineQueue();
  queue.push({
    id: `queue-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    timestamp: Date.now(),
    retries: 0,
  });
  saveOfflineQueue(queue);
}

export async function flushOfflineQueue(supabase: SupabaseClient): Promise<number> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return 0;
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  const remaining: QueuedAction[] = [];
  let processedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === "save_diagnostic") {
        const { error } = await supabase.from("diagnostic_results").insert(item.payload);
        if (error) throw error;
        processedCount++;
      } else {
        // Tipo no soportado o desconocido, descartar
      }
    } catch (err) {
      console.warn(`Failed to flush queued action ${item.id}:`, err);
      if (item.retries < MAX_RETRIES) {
        remaining.push({ ...item, retries: item.retries + 1 });
      }
    }
  }

  saveOfflineQueue(remaining);
  return processedCount;
}

export function initOfflineQueueSync(supabase: SupabaseClient): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => {
    flushOfflineQueue(supabase).then((count) => {
      if (count > 0) {
        console.info(`[OfflineQueue] Sincronizadas ${count} acciones pendientes.`);
      }
    });
  };

  window.addEventListener("online", handleOnline);
  // Intentar flush inmediato por si había pendientes de una sesión anterior
  if (navigator.onLine) {
    handleOnline();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}
