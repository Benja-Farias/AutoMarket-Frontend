import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth.js';
import { api } from '../utils/api.js';
import { useVehicles } from '../hooks/useVehicles.js';

const VACIO = {
  marca: '',
  modelo: '',
  anio: 2024,
  transmision: 'Automático',
  km: 0,
  combustible: 'Bencina',
  precio: 10000000,
  estado: 'Usado',
  imagen: 'auto1',
  destacado: false
};

export default function AdminPage() {
  const user = getSession();
  const { vehiculos, cargando, error, recargar } = useVehicles();
  const [actual, setActual] = useState({ ...VACIO });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'ADMIN') {
    return (
      <div className="container my-5 alert alert-danger">
        Acceso restringido a administradores.
      </div>
    );
  }

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setActual((v) => ({
      ...v,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    const body = {
      ...actual,
      anio: Number(actual.anio),
      km: Number(actual.km),
      precio: Number(actual.precio)
    };

    delete body.id;
    delete body.nombre;
    delete body.detalle;

    try {
      await api(editId ? `/vehiculos/${editId}` : '/vehiculos', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      });

      setMensaje(editId ? 'Vehículo modificado.' : 'Vehículo registrado.');
      setActual({ ...VACIO });
      setEditId(null);
      await recargar();
    } catch (err) {
      setMensaje(`Error: ${err.message}`);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este vehículo?')) {
      return;
    }

    try {
      await api(`/vehiculos/${id}`, { method: 'DELETE' });
      setMensaje('Vehículo eliminado.');
      await recargar();
    } catch (err) {
      setMensaje(`Error: ${err.message}`);
    }
  };

  const editar = (v) => {
    const {
      marca,
      modelo,
      anio,
      transmision,
      km,
      combustible,
      precio,
      estado,
      destacado
    } = v;

    setActual({
      marca,
      modelo,
      anio,
      transmision,
      km,
      combustible,
      precio,
      estado,
      destacado,
      imagen: v.imagenCodigo || 'auto1'
    });

    setEditId(v.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container my-5">
      <h1 className="h3 mb-4">Administración de vehículos</h1>

      {mensaje && (
        <div role="alert" className="alert alert-info">
          {mensaje}
        </div>
      )}

      <form onSubmit={guardar} className="card card-body mb-4">
        <h2 className="h5">
          {editId ? 'Editar vehículo' : 'Nuevo vehículo'}
        </h2>

        <div className="row g-3">
          {['marca', 'modelo', 'anio', 'transmision', 'km', 'combustible', 'precio'].map((name) => (
            <div className="col-md-4" key={name}>
              <label className="form-label text-capitalize" htmlFor={`v-${name}`}>
                {name}
              </label>
              <input
                className="form-control"
                id={`v-${name}`}
                name={name}
                required
                value={actual[name]}
                type={['anio', 'km', 'precio'].includes(name) ? 'number' : 'text'}
                min={['anio', 'km', 'precio'].includes(name) ? 0 : undefined}
                onChange={cambiar}
              />
            </div>
          ))}

          <div className="col-md-4">
            <label className="form-label" htmlFor="v-estado">Estado</label>
            <select
              id="v-estado"
              className="form-select"
              name="estado"
              value={actual.estado}
              onChange={cambiar}
            >
              <option>Nuevo</option>
              <option>Usado</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="v-imagen">Imagen</label>
            <select
              id="v-imagen"
              className="form-select"
              name="imagen"
              value={actual.imagen}
              onChange={cambiar}
            >
              <option value="auto1">Imagen 1</option>
              <option value="auto2">Imagen 2</option>
              <option value="auto3">Imagen 3</option>
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="destacado"
                checked={actual.destacado}
                onChange={cambiar}
              />
              Destacado
            </label>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary">
            {editId ? 'Guardar cambios' : 'Crear vehículo'}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditId(null);
                setActual({ ...VACIO });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando && <p>Cargando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.nombre}</td>
                <td>${Number(v.precio).toLocaleString('es-CL')}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => editar(v)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminar(v.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
