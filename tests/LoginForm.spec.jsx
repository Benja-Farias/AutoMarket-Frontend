import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../src/components/LoginForm.jsx';
import { renderInDom, typeInto, submitForm } from './helpers.js';

describe('<LoginForm />', () => {
  let vista;

  afterEach(() => {
    if (vista) vista.cleanup();
    vista = null;
  });

  it('muestra errores y no llama a onLogin con el formulario vacío', () => {
    const onLogin = jasmine.createSpy('onLogin');
    vista = renderInDom(
      <MemoryRouter>
        <LoginForm onLogin={onLogin} />
      </MemoryRouter>
    );

    submitForm(vista.container.querySelector('form'));

    expect(vista.container.querySelector('#correoError').textContent)
      .toBe('El correo es obligatorio.');
    expect(vista.container.querySelector('#passwordError').textContent)
      .toBe('La contraseña es obligatoria.');
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('con datos válidos llama a onLogin, muestra bienvenida y ejecuta onSuccess', async () => {
    const usuario = { nombre: 'Carolina', correo: 'caro@gmail.com' };
    const onLogin = jasmine.createSpy('onLogin')
      .and.resolveTo({ ok: true, user: usuario });
    const onSuccess = jasmine.createSpy('onSuccess');

    vista = renderInDom(
      <MemoryRouter>
        <LoginForm onLogin={onLogin} onSuccess={onSuccess} />
      </MemoryRouter>
    );

    typeInto(vista.container.querySelector('#correo'), 'caro@gmail.com');
    typeInto(vista.container.querySelector('#password'), 'clave1234');

    // handleSubmit es async: esperar su resolución y el render de React.
    await act(async () => {
      vista.container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    expect(onLogin).toHaveBeenCalledWith({
      correo: 'caro@gmail.com',
      password: 'clave1234',
    });
    expect(vista.container.querySelector('#mensajeFinal')?.textContent)
      .toBe('¡Bienvenido, Carolina!');
    expect(onSuccess).toHaveBeenCalledWith(usuario);
  });
});
