import { useEffect, useState } from 'react';
import { getSession, logout, restoreSession } from '../utils/auth.js';
export function useSession() {
  const [usuario, setUsuario] = useState(getSession);
  useEffect(() => {
    const update = () => setUsuario(getSession());
    window.addEventListener('automarket:session', update);
    const onStorage = (event) => {
      if (event.key === 'automarket:logout-event') {
        sessionStorage.removeItem('am_user');
        sessionStorage.removeItem('am_access');
        update();
      }
    };
    window.addEventListener('storage', onStorage);
    restoreSession();
    return () => {
      window.removeEventListener('automarket:session', update);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const cerrarSesion = async () => { await logout(); setUsuario(null); };
  return { usuario, cerrarSesion };
}
