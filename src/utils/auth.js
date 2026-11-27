import { api, setAccessToken, getAccessToken } from './api.js';
export const SESSION_KEY = 'am_user';
export const getSession = () => {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};
function store(auth) {
  setAccessToken(auth.accessToken);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(auth.user));
  window.dispatchEvent(new Event('automarket:session'));
  return auth.user;
}
export async function registerUser({ nombre, correo, password }) {
  const result = await api('/auth/register', { method: 'POST', body: JSON.stringify({ nombre, correo, password }) });
  return { ok: true, user: store(result) };
}
export async function loginUser(correo, password) {
  const result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ correo, password }) });
  return { ok: true, user: store(result) };
}
export async function restoreSession() {
  try {
    const auth = await api('/auth/refresh', { method: 'POST' }, false);
    return store(auth);
  } catch {
    setAccessToken('');
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('automarket:session'));
    return null;
  }
}
export async function logout() {
  try { await api('/auth/logout', { method: 'POST' }, false); }
  finally {
    setAccessToken('');
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.setItem('automarket:logout-event', String(Date.now()));
    window.dispatchEvent(new Event('automarket:session'));
  }
}
