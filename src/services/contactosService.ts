/**
 * Servicio de integración con el Gateway Central de Contactos (MejoraContactos / CRM)
 * Proxy server-side: Edge Function `sync-contactos` (sin secretos en el bundle del navegador).
 *
 * Principio: Fail-Soft obligatorio. Si el proxy o CRM externo falla,
 * el flujo de la aplicación jamás debe interrumpirse ni mostrar errores al usuario final.
 */
import { supabase } from '@/integrations/supabase/client';

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

export function getStoredPersonaId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PERSONA_ID);
  } catch {
    return null;
  }
}

export function setStoredPersonaId(personaId: string): void {
  try {
    if (personaId) {
      localStorage.setItem(STORAGE_KEY_PERSONA_ID, personaId);
    }
  } catch {
    // Almacenamiento no disponible o bloqueado por navegador
  }
}

export async function sincronizarUsuarioConContactos(
  payload: UserContactPayload
): Promise<SincronizarContactoResponse> {
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

  const { data, error } = await supabase.functions.invoke('sync-contactos', {
    body,
  });

  if (error) {
    throw new Error(`Error sincronizando contacto (${error.message})`);
  }

  if (data?.skipped) {
    throw new Error('Sincronización omitida en gateway');
  }

  const resData = data as SincronizarContactoResponse;
  if (resData?.persona_id) {
    setStoredPersonaId(resData.persona_id);
  }

  return resData;
}

/**
 * Versión fail-soft obligatoria: captura cualquier error sin interrumpir la UI
 */
export async function sincronizarUsuarioBestEffort(
  payload: UserContactPayload
): Promise<SincronizarContactoResponse | null> {
  try {
    return await sincronizarUsuarioConContactos(payload);
  } catch (err) {
    console.warn('[contactosService] Sincronización best-effort omitida o fallida:', err);
    return null;
  }
}
