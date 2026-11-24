let accessToken = sessionStorage.getItem('am_access') || '';
export const getAccessToken = () => accessToken;
export function setAccessToken(value) {
  accessToken = value || '';
  if (accessToken) sessionStorage.setItem('am_access', accessToken);
  else sessionStorage.removeItem('am_access');
}
export async function api(path, options = {}, retry = true) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`/api${path}`, { ...options, headers, credentials: 'same-origin' });
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    try {
      const refreshed = await api('/auth/refresh', { method: 'POST' }, false);
      setAccessToken(refreshed.accessToken);
      return api(path, options, false);
    } catch {
      setAccessToken('');
    }
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || data.detail || `Error HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
