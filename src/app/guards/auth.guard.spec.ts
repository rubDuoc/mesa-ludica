import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard, adminGuard } from './auth.guard';
import { Usuario } from '../models/usuario';

/** Sesiones de prueba que se siembran en localStorage antes de crear el servicio. */
const CLIENTE: Usuario = { id: 'u-002', nombre: 'Cliente Demo', email: 'cliente@correo.cl', password: 'Cliente123!', rol: 'cliente' };
const ADMIN: Usuario = { id: 'u-001', nombre: 'Administrador', email: 'admin@mesaludica.cl', password: 'Admin123!', rol: 'admin' };

/**
 * Los guards son funcionales y usan `inject()`, por lo que se ejecutan dentro
 * de un contexto de inyección con `TestBed.runInInjectionContext`. Sus
 * argumentos (ruta y estado) no se usan, así que se pasan como objetos vacíos.
 * La sesión se siembra en localStorage: el `AuthService` la lee al construirse
 * (no hace falta llamar al login asíncrono contra Firebase).
 */
describe('Guards de rutas', () => {
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    router = TestBed.inject(Router);
  });

  /** Simula una sesión previamente iniciada persistida en localStorage. */
  function sembrarSesion(usuario: Usuario): void {
    localStorage.setItem('ml_sesion', JSON.stringify(usuario));
  }

  it('authGuard bloquea a un visitante sin sesión y redirige a /login', () => {
    const resultado = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/login');
  });

  it('authGuard permite el acceso con sesión iniciada', () => {
    sembrarSesion(CLIENTE);
    const resultado = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(resultado).toBeTrue();
  });

  it('adminGuard bloquea a un cliente y redirige a /login', () => {
    sembrarSesion(CLIENTE);
    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/login');
  });

  it('adminGuard permite el acceso a un administrador', () => {
    sembrarSesion(ADMIN);
    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(resultado).toBeTrue();
  });
});
