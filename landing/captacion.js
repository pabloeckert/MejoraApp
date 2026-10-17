/**
 * CAPTACION.JS — Integración de Formulario Estático con MejoraNucleo API
 * Diseñado para despliegue en Hostinger (public_html) con soporte Offline y Reintentos Automáticos.
 * 
 * Cumplimiento de Directivas:
 * - Intercepción limpia del evento submit (e.preventDefault).
 * - Envío formal JSON contra POST /api/prospectos.
 * - Fallback Offline en localStorage (clave: 'mejora_leads_pendientes').
 * - Sincronizador en evento 'online' de reconexión.
 */

(function () {
  'use strict';

  // Configuración de Endpoint REST
  // Permite sobreescritura externa mediante window.MEJORA_API_URL (para testing o entornos custom)
  const isLocalEnv =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'file:');

  const API_URL =
    (typeof window !== 'undefined' && window.MEJORA_API_URL) ||
    (isLocalEnv ? 'http://localhost:3000/api/prospectos' : '/api/prospectos');

  const STORAGE_KEY = 'mejora_leads_pendientes';

  // Elementos del DOM
  const form = document.getElementById('prospecto-form');
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');
  const inputTelefono = document.getElementById('telefono');
  const inputCanalOrigen = document.getElementById('canalOrigen');
  const btnSubmit = document.getElementById('btn-submit');

  const statusSuccess = document.getElementById('status-success');
  const statusError = document.getElementById('status-error');
  const statusOffline = document.getElementById('status-offline');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');

  const errorNombre = document.getElementById('error-nombre');
  const errorEmail = document.getElementById('error-email');

  if (!form) return;

  // 1. Intercepción y Procesamiento del Formulario
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    ocultarAlertas();

    const nombre = (inputNombre && inputNombre.value ? inputNombre.value.trim() : '');
    const email = (inputEmail && inputEmail.value ? inputEmail.value.trim() : '');
    const telefono = (inputTelefono && inputTelefono.value ? inputTelefono.value.trim() : '');
    const canalOrigen =
      (inputCanalOrigen && inputCanalOrigen.value ? inputCanalOrigen.value.trim() : 'sitio_web_hostinger');

    // Validación client-side previa (ergonomía y prevención de carga vacía)
    const esValido = validarCampos(nombre, email);
    if (!esValido) {
      return;
    }

    const payload = {
      nombre,
      email,
      telefono,
      canalOrigen
    };

    setLoading(true);

    try {
      // Envío formal mediante fetch API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 || (response.ok && data && data.id)) {
        mostrarExito();
        form.reset();
      } else {
        // Respuesta del servidor con código de error de negocio (ej: 400 Bad Request)
        const msg = (data && data.error) || 'Ocurrió un error al procesar tu solicitud. Por favor verificá los datos.';
        mostrarError('Error en la solicitud', msg);
      }
    } catch (err) {
      // Servidor caído, problemas de CORS local o desconexión de red -> Fallback Offline
      console.warn('[MejoraContinua] Error de comunicación con la API. Guardando lead en almacenamiento offline:', err);
      guardarLeadLocal(payload);
      mostrarOffline();
      form.reset();
    } finally {
      setLoading(false);
    }
  });

  // Limpieza reactiva de errores al tipear
  if (inputNombre) {
    inputNombre.addEventListener('input', () => {
      inputNombre.classList.remove('input-invalid');
      if (errorNombre) errorNombre.style.display = 'none';
    });
  }

  if (inputEmail) {
    inputEmail.addEventListener('input', () => {
      inputEmail.classList.remove('input-invalid');
      if (errorEmail) errorEmail.style.display = 'none';
    });
  }

  // 2. Funciones de Validación
  function validarCampos(nombre, email) {
    let valido = true;

    if (!nombre || nombre.length < 2) {
      if (inputNombre) inputNombre.classList.add('input-invalid');
      if (errorNombre) {
        errorNombre.textContent = 'Por favor ingresá tu nombre y apellido.';
        errorNombre.style.display = 'block';
      }
      valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (inputEmail) inputEmail.classList.add('input-invalid');
      if (errorEmail) {
        errorEmail.textContent = 'Ingresá un correo electrónico válido (ej: nombre@empresa.com).';
        errorEmail.style.display = 'block';
      }
      valido = false;
    }

    return valido;
  }

  // 3. Manejo de Estados Visuales en Interfaz
  function setLoading(isLoading) {
    if (!btnSubmit) return;
    if (isLoading) {
      btnSubmit.disabled = true;
      btnSubmit.classList.add('loading');
    } else {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove('loading');
    }
  }

  function ocultarAlertas() {
    if (statusSuccess) statusSuccess.style.display = 'none';
    if (statusError) statusError.style.display = 'none';
    if (statusOffline) statusOffline.style.display = 'none';
  }

  function mostrarExito() {
    if (statusSuccess) {
      statusSuccess.style.display = 'flex';
      statusSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function mostrarError(titulo, mensaje) {
    if (statusError) {
      if (errorTitle) errorTitle.textContent = titulo;
      if (errorMessage) errorMessage.textContent = mensaje;
      statusError.style.display = 'flex';
      statusError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function mostrarOffline() {
    if (statusOffline) {
      statusOffline.style.display = 'flex';
      statusOffline.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // 4. Fallback Offline y Sincronización Automática con LocalStorage
  function guardarLeadLocal(lead) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const pendientes = raw ? JSON.parse(raw) : [];
      pendientes.push({
        ...lead,
        fechaIntento: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendientes));
      console.info(`[MejoraContinua] Lead almacenado en cola offline. Total pendientes: ${pendientes.length}`);
    } catch (e) {
      console.error('[MejoraContinua] Fallo al escribir en localStorage:', e);
    }
  }

  async function sincronizarLeadsPendientes() {
    let pendientes = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      pendientes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('[MejoraContinua] Error al leer leads pendientes de localStorage:', e);
      return;
    }

    if (!Array.isArray(pendientes) || pendientes.length === 0) {
      return;
    }

    console.info(`[MejoraContinua] Sincronizando ${pendientes.length} leads pendientes...`);
    const fallidos = [];

    for (const lead of pendientes) {
      try {
        const { fechaIntento, ...payload } = lead;
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.status === 201 || res.ok) {
          console.info(`[MejoraContinua] Lead de ${payload.email} sincronizado exitosamente.`);
        } else if (res.status >= 500) {
          // Error transitorio de servidor -> mantener en cola
          fallidos.push(lead);
        } else {
          // Error 400 (ej: duplicado o malformado) -> descartar para no bloquear la cola
          console.warn(`[MejoraContinua] Lead ${payload.email} rechazado por validación (${res.status}). Descartando.`);
        }
      } catch (err) {
        // Sigue sin conexión -> conservar en la cola
        fallidos.push(lead);
      }
    }

    try {
      if (fallidos.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallidos));
        console.info(`[MejoraContinua] Quedan ${fallidos.length} leads pendientes de sincronización.`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        console.info('[MejoraContinua] Sincronización completa: todos los leads offline fueron emitidos.');
      }
    } catch (e) {
      console.error('[MejoraContinua] Error al actualizar localStorage tras sincronización:', e);
    }
  }

  // 5. Listeners de Conectividad
  if (typeof window !== 'undefined') {
    // Escuchar el evento de reconexión
    window.addEventListener('online', () => {
      console.info('[MejoraContinua] Red restablecida (evento online). Iniciando sincronización...');
      sincronizarLeadsPendientes();
    });

    // Intento preventivo al cargar la página si el navegador indica conexión activa
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      sincronizarLeadsPendientes();
    }
  }
})();
