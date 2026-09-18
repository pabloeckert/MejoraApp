/**
 * Servicio de integración con el Gateway Central de Contactos (MejoraContactos / CRM)
 * Endpoint: https://tzatuvxatsduuslxqdtm.supabase.co/functions/v1/contactos-api
 *
 * Principio: Fail-Soft obligatorio. Si la API de contactos no responde o falla la red,
 * el flujo de la aplicación jamás debe interrumpirse ni mostrar errores al usuario final.
 */

export const CONTACTOS_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACTOS_API_URL) ||
  (typeof process !== 'undefined' && (process.env?.VITE_CONTACTOS_API_URL || process.env?.CONTACTOS_API_URL)) ||
  'https://tzatuvxatsduuslxqdtm.supabase.co/functions/v1/contactos-api';

export const CONTACTOS_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACTOS_API_KEY) ||
  (typeof process !== 'undefined' && (process.env?.VITE_CONTACTOS_API_KEY || process.env?.CONTACTOS_API_KEY)) ||
  'a87936c05a3b39471007488850ec9ee568ded426f245e7c87f4d63a74483917b';

export const STORAGE_KEY_PERSONA_ID = 'mejora_persona_id';

export interface UserContactPayload {
  source?: string;
  email?: string;
  nombre?: string;
  telefono?: string;
  cargo?: string;
  organizacion?: string;
  metadata?: {
    app_user_id?: string;
    empresa?: string;
    cargo?: string;
    [key: string]: unknown;
  };
  persona_id?: string;
  nota_referencia?: string;
  [key: string]: unknown;
}

export interface SincronizarContactoResponse {
  persona_id: string;
  creado: boolean;
}

/**
 * Obtiene el persona_id almacenado localmente en el cliente
 */
export function getStoredPersonaId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PERSONA_ID);
  } catch {
    return null;
  }
}

/**
 * Persiste el persona_id asignado en el almacenamiento local
 */
export function setStoredPersonaId(personaId: string): void {
  try {
    if (personaId) {
      localStorage.setItem(STORAGE_KEY_PERSONA_ID, personaId);
    }
  } catch {
    // Almacenamiento no disponible o bloqueado por navegador
  }
}

/**
 * Sincroniza un usuario de MejoraApp hacia el motor central de contactos
 * Payload unificado:
 * {
 *   source: "mejora_app",
 *   email: email,
 *   nombre: nombre,
 *   telefono: telefono,
 *   metadata: { app_user_id: userId }
 * }
 */
export async function sincronizarUsuarioConContactos(
  payload: UserContactPayload
): Promise<SincronizarContactoResponse> {
  const url = CONTACTOS_API_URL;
  const key = CONTACTOS_API_KEY;

  if (!url || !key) {
    throw new Error('Configuración de contactos-api incompleta (falta URL o API Key)');
  }

  const existingPersonaId = payload.persona_id || getStoredPersonaId();

  const body: Record<string, unknown> = {
    source: payload.source || 'mejora_app',
    email: payload.email,
    nombre: payload.nombre,
    telefono: payload.telefono,
    cargo: payload.cargo,
    organizacion: payload.organizacion,
    metadata: {
      app_user_id: payload.metadata?.app_user_id,
      ...(payload.metadata || {}),
    },
    nota_referencia:
      payload.nota_referencia ||
      `[MejoraApp] Usuario sincronizado desde PWA (ID: ${payload.metadata?.app_user_id || 'n/a'})`,
  };

  if (existingPersonaId) {
    body.persona_id = existingPersonaId;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': key,
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error sincronizando usuario (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as SincronizarContactoResponse;
  if (data?.persona_id) {
    setStoredPersonaId(data.persona_id);
  }

  return data;
}

/**
 * Wrapper de sincronización asíncrona segura (Fail-Soft)
 * No lanza excepciones; registra advertencias en consola y devuelve el persona_id si tuvo éxito.
 */
export async function sincronizarUsuarioBestEffort(
  payload: UserContactPayload
): Promise<string | null> {
  try {
    const res = await sincronizarUsuarioConContactos(payload);
    return res.persona_id;
  } catch (err) {
    console.warn('[contactosService] Sincronización best-effort omitida o fallida:', err);
    return null;
  }
}
