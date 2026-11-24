import { useCallback, useEffect, useState } from 'react';
import { api } from '../utils/api.js';
import { imagenes } from '../assets/images/index.js';
import { formatNumber } from '../utils/format.js';
export function useVehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const rows = await api('/vehiculos');
      setVehiculos(rows.map(v => ({
        ...v,
        nombre: `${v.marca} ${v.modelo} ${v.anio}`,
        detalle: `${v.transmision} • ${formatNumber(v.km)} km • ${v.combustible}`,
        imagenCodigo: v.imagen,
        imagen: imagenes[v.imagen] || imagenes.auto1,
      })));
      setError('');
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { recargar(); }, [recargar]);
  return { vehiculos, cargando, error, recargar };
}
