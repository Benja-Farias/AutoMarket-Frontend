import { useEffect, useState } from 'react';
import { getSession, logout, restoreSession } from '../utils/auth.js';
export function useSession() {
  const [usuario, setUsuario] = useState(getSession);
  useEffect(() => {
    const update = () => setUsuario(getSession());
    window.addEventListener('automarket:session', update);
    restoreSession();
    return () => window.removeEventListener('automarket:session', update);
  }, []);
  const cerrarSesion = async () => { await logout(); setUsuario(null); };
  return { usuario, cerrarSesion };
}
