import Banner from '../components/Banner.jsx';
import FeaturedCarousel from '../components/CarruselHome.jsx';
import { useVehicles } from '../hooks/useVehicles.js';

export default function HomePage() {
  const { vehiculos, cargando, error } = useVehicles();

  return (
    <>
      <Banner />

      <div className="container my-5">
        <h2 className="text-center mb-4 fw-bold">Vehículos Destacados</h2>

        {cargando && <p>Cargando vehículos...</p>}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!cargando && !error && (
          <FeaturedCarousel productos={vehiculos.filter((p) => p.destacado)} />
        )}
      </div>
    </>
  );
}
