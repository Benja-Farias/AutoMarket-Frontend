import { useMemo, useState } from 'react';
import CatalogFilters from '../components/FiltrosCatalogo.jsx';
import CarCard from '../components/CarCard.jsx';
import { useVehicles } from '../hooks/useVehicles.js';
import {
  FILTROS_INICIALES,
  filterProducts,
  sortProducts,
  getBrands
} from '../utils/filters.js';

export default function CatalogPage() {
  const { vehiculos, cargando, error } = useVehicles();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [orden, setOrden] = useState('asc');

  const marcas = useMemo(() => getBrands(vehiculos), [vehiculos]);
  const visibles = useMemo(
    () => sortProducts(filterProducts(vehiculos, filtros), orden),
    [vehiculos, filtros, orden]
  );

  return (
    <div className="container-fluid py-4 px-lg-5">
      <div className="row g-4">
        <aside className="col-12 col-md-4 col-lg-3">
          <CatalogFilters
            filtros={filtros}
            marcas={marcas}
            onChange={setFiltros}
          />
        </aside>

        <section className="col-12 col-md-8 col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded shadow-sm">
            <span className="text-muted small">
              Mostrando <strong>{visibles.length}</strong> vehículos
            </span>
            <select
              className="form-select form-select-sm w-auto"
              aria-label="Ordenar por precio"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="asc">Menor precio</option>
              <option value="desc">Mayor precio</option>
            </select>
          </div>

          {cargando && <p>Cargando vehículos...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!cargando && !error && (
            visibles.length === 0 ? (
              <div className="alert alert-light border">
                No hay vehículos que coincidan con los filtros.
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {visibles.map((p) => (
                  <div className="col" key={p.id}>
                    <CarCard producto={p} mostrarEstado />
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}
