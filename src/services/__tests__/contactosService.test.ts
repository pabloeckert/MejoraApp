import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sincronizarUsuarioConContactos,
  sincronizarUsuarioBestEffort,
  getStoredPersonaId,
  setStoredPersonaId,
  STORAGE_KEY_PERSONA_ID,
  CONTACTOS_API_URL,
  CONTACTOS_API_KEY,
} from '../contactosService';

describe('contactosService (Integración MejoraApp -> contactos-api)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('debe tener configurados el endpoint y la API key de MejoraApp', () => {
    expect(CONTACTOS_API_URL).toContain('contactos-api');
    expect(CONTACTOS_API_KEY).toBeDefined();
    expect(CONTACTOS_API_KEY.length).toBe(64); // 32 bytes hex
  });

  it('debe gestionar getStoredPersonaId y setStoredPersonaId correctamente', () => {
    expect(getStoredPersonaId()).toBeNull();

    const testId = 'a42e557a-8391-4d5c-aa47-3b243020d23d';
    setStoredPersonaId(testId);

    expect(getStoredPersonaId()).toBe(testId);
    expect(localStorage.getItem(STORAGE_KEY_PERSONA_ID)).toBe(testId);
  });

  it('sincronizarUsuarioBestEffort no debe lanzar excepción si fetch falla (Fail-Soft)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error simulado'));

    const result = await sincronizarUsuarioBestEffort({
      email: 'test@mejoraok.com',
      nombre: 'Test Fail Soft',
    });

    expect(result).toBeNull();
  });

  it('debe enviar el payload correcto con source mejora_app', async () => {
    const mockResponse = {
      persona_id: 'test-uuid-1234',
      creado: true,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const respuesta = await sincronizarUsuarioConContactos({
      email: 'socio@comunidad.com',
      nombre: 'Juan Pérez',
      telefono: '+5493764556677',
      metadata: {
        app_user_id: 'usr_abc_123',
        empresa: 'Empresa SA',
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];

    expect(calledUrl).toBe(CONTACTOS_API_URL);
    expect(calledOptions?.method).toBe('POST');
    expect(calledOptions?.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Api-Key': CONTACTOS_API_KEY,
    });

    const parsedBody = JSON.parse(calledOptions?.body as string);
    expect(parsedBody.source).toBe('mejora_app');
    expect(parsedBody.email).toBe('socio@comunidad.com');
    expect(parsedBody.nombre).toBe('Juan Pérez');
    expect(parsedBody.metadata.app_user_id).toBe('usr_abc_123');

    expect(respuesta.persona_id).toBe('test-uuid-1234');
    expect(getStoredPersonaId()).toBe('test-uuid-1234');
  });
});
