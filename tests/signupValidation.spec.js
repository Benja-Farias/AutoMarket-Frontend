import { validateSignup } from '../src/utils/validators.js';

describe('Registro React y validación compatible con Spring Boot', () => {
  it('rechaza contraseña menor de ocho caracteres', () => {
    const errors = validateSignup({ nombre: 'Ana', correo: 'ana@gmail.com', password: '1234567' });
    expect(errors.password).toBe('La contraseña debe tener al menos 8 caracteres.');
  });

  it('acepta contraseña válida y correo bien formado', () => {
    const errors = validateSignup({ nombre: 'Ana', correo: 'ana@gmail.com', password: 'clave1234' });
    expect(errors.password).toBe('');
    expect(errors.correo).toBe('');
  });

  it('rechaza correo inválido', () => {
    const errors = validateSignup({ nombre: 'Ana', correo: 'ana@', password: 'clave1234' });
    expect(errors.correo).toBe('Ingresa un correo válido.');
  });
});
