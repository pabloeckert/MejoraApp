import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sincronizarUsuarioConContactos,
  sincronizarUsuarioBestEffort,
  getStoredPersonaId,
  setStoredPersonaId,
  STORAGE_KEY_PERSONA_ID,
} from '../contactosService';

const mockInvoke = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

describe('contactosService (Proxy server-side sync-contactos)', () => {
  beforeEach(() => {
    localStorage.clear();
    mockInvoke.mockReset();
  });

  it('debe gestionar getStoredPersonaId y setStoredPersonaId correctamente', () => {
    expect(getStoredPersonaId()).toBeNull();

    const testId = 'a42e557a-8391-4d5c-aa47-3b243020d23d';
    setStoredPersonaId(testId);

    expect(getStoredPersonaId()).toBe(testId);
    expect(localStorage.getItem(STORAGE_KEY_PERSONA_ID)).toBe(testId);
  });

  it('sincronizarUsuarioBestEffort no debe lanzar excepción si Edge Function falla (Fail-Soft)', async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: new Error('Network error simulado'),
    });

    const result = await sincronizarUsuarioBestEffort({
      email: 'test@mejoraok.com',
      nombre: 'Test Fail Soft',
    });

    expect(result).toBeNull();
  });

  it('debe invocar sync-contactos con el payload correcto sin exponer API keys en cliente', async () => {
    const mockResponse = {
      persona_id: 'test-uuid-1234',
      creado: true,
    };

    mockInvoke.mockResolvedValueOnce({
      data: mockResponse,
      error: null,
    });

    const respuesta = await sincronizarUsuarioConContactos({
      email: 'socio@comunidad.com',
      nombre: 'Juan Pérez',
      telefono: '+5493764556677',
      metadata: {
        app_user_id: 'usr_abc_123',
        empresa: 'Empresa SA',
      },
    });

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    const [fnName, options] = mockInvoke.mock.calls[0];
    expect(fnName).toBe('sync-contactos');

    const body = options?.body as Record<string, unknown>;
    expect(body.source).toBe('mejora_app');
    expect(body.email).toBe('socio@comunidad.com');
    expect(body.nombre).toBe('Juan Pérez');
    expect((body.metadata as Record<string, unknown>).app_user_id).toBe('usr_abc_123');

    expect(respuesta.persona_id).toBe('test-uuid-1234');
    expect(getStoredPersonaId()).toBe('test-uuid-1234');
  });
});
