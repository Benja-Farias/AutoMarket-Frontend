import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth.js';

export default function PaginaMiCuenta() {
  const usuario = getSession();
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <div className="container my-5">
      <section className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 620 }}>
        <div className="card-body p-4">
          <h1 className="h3 fw-bold mb-4">Mi cuenta</h1>
          <dl className="row mb-0">
            <dt className="col-sm-4">Nombre</dt>
            <dd className="col-sm-8">{usuario.nombre}</dd>
            <dt className="col-sm-4">Correo electrónico</dt>
            <dd className="col-sm-8">{usuario.correo}</dd>
            <dt className="col-sm-4">Rol</dt>
            <dd className="col-sm-8">{usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</dd>
          </dl>
        </div>
      </section>
    </div>
  );
}
