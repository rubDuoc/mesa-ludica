import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('inicia sin sesión activa', () => {
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('inicia sesión con credenciales válidas de admin', () => {
    const ok = service.login('admin@mesaludica.cl', 'Admin123!');
    expect(ok).toBeTrue();
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeTrue();
  });

  it('rechaza credenciales inválidas', () => {
    const ok = service.login('admin@mesaludica.cl', 'claveincorrecta');
    expect(ok).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('un cliente autenticado no es administrador', () => {
    service.login('cliente@correo.cl', 'Cliente123!');
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
  });

  it('logout cierra la sesión', () => {
    service.login('cliente@correo.cl', 'Cliente123!');
    service.logout();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('registra un usuario nuevo, queda con sesión y lo recuerda', () => {
    service.registrar({ nombre: 'Nuevo', email: 'nuevo@correo.cl', password: 'Clave123!' });
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
    expect(service.emailRegistrado('nuevo@correo.cl')).toBeTrue();
  });

  it('recupera la sesión guardada en localStorage al iniciar', () => {
    // Simulamos una sesión previamente persistida.
    localStorage.setItem('ml_sesion', JSON.stringify({
      nombre: 'Cliente Demo', email: 'cliente@correo.cl', password: 'Cliente123!', rol: 'cliente'
    }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const recreado = TestBed.inject(AuthService);
    expect(recreado.estaAutenticado()).toBeTrue();
    expect(recreado.usuario()?.email).toBe('cliente@correo.cl');
  });
});
