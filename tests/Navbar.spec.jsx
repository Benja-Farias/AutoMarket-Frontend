import { MemoryRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import { renderInDom } from './helpers.js';

describe('<Navbar /> - menú por rol', () => {
  let vista;
  afterEach(() => vista && vista.cleanup());

  it('muestra el panel de control únicamente cuando el usuario es ADMIN', () => {
    vista = renderInDom(
      <MemoryRouter>
        <Navbar usuario={{ nombre: 'Administrador', rol: 'ADMIN' }} />
      </MemoryRouter>
    );
    const panel = [...vista.container.querySelectorAll('a')]
      .find((link) => link.textContent === 'Panel de control');
    expect(panel).toBeDefined();
    expect(panel.getAttribute('href')).toBe('/gestion/');
    expect(vista.container.textContent).toContain('Mi cuenta');
    expect(vista.container.textContent).toContain('Cerrar sesión');
  });

  it('no muestra el panel de control a un CLIENTE', () => {
    vista = renderInDom(
      <MemoryRouter>
        <Navbar usuario={{ nombre: 'Cliente', rol: 'CLIENTE' }} />
      </MemoryRouter>
    );
    expect(vista.container.textContent).not.toContain('Panel de control');
    expect(vista.container.textContent).toContain('Mi cuenta');
  });

  it('muestra ingreso y registro cuando no existe sesión', () => {
    vista = renderInDom(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(vista.container.textContent).toContain('Ingresar');
    expect(vista.container.textContent).toContain('Regístrate');
    expect(vista.container.textContent).not.toContain('Panel de control');
  });
});
