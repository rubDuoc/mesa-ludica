import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
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
});
