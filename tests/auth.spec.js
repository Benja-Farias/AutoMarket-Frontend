import { loginUser, SESSION_KEY } from '../src/utils/auth.js';
import { getAccessToken, setAccessToken } from '../src/utils/api.js';

describe('auth: integración del cliente con la API REST', () => {
  let fetchAnterior;

  beforeEach(() => {
    fetchAnterior = globalThis.fetch;
    sessionStorage.removeItem(SESSION_KEY);
    setAccessToken('');
  });

  afterEach(() => {
    globalThis.fetch = fetchAnterior;
    sessionStorage.removeItem(SESSION_KEY);
    setAccessToken('');
  });

  it('loginUser envía credenciales a Spring Boot y conserva la sesión devuelta', async () => {
    const usuario = { nombre: 'Carolina', correo: 'caro@gmail.com', rol: 'CLIENTE' };
    const tokenFicticio = 'jwt-simulado-solo-para-pruebas';
    const fetchSpy = jasmine.createSpy('fetch').and.resolveTo({
      ok: true,
      status: 200,
      json: async () => ({ accessToken: tokenFicticio, user: usuario }),
    });
    globalThis.fetch = fetchSpy;

    const resultado = await loginUser('caro@gmail.com', 'clave1234');

    expect(resultado).toEqual({ ok: true, user: usuario });
    expect(fetchSpy).toHaveBeenCalled();
    const [url, opciones] = fetchSpy.calls.mostRecent().args;
    expect(url).toBe('/api/auth/login');
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({
      correo: 'caro@gmail.com',
      password: 'clave1234',
    });
    expect(opciones.credentials).toBe('same-origin');
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY))).toEqual(usuario);
    expect(getAccessToken()).toBe(tokenFicticio);
  });

  it('loginUser rechaza credenciales incorrectas sin iniciar sesión', async () => {
    globalThis.fetch = jasmine.createSpy('fetch').and.resolveTo({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Correo o contraseña incorrectos.' }),
    });

    await expectAsync(loginUser('caro@gmail.com', 'incorrecta1'))
      .toBeRejectedWithError('Correo o contraseña incorrectos.');

    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    expect(getAccessToken()).toBe('');
  });
});
