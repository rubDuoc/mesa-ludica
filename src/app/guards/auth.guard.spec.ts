import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard, adminGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

/**
 * Los guards son funcionales y usan `inject()`, por lo que se ejecutan dentro
 * de un contexto de inyección con `TestBed.runInInjectionContext`. Sus
 * argumentos (ruta y estado) no se usan, así que se pasan como objetos vacíos.
 */
describe('Guards de rutas', () => {
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('authGuard bloquea a un visitante sin sesión y redirige a /login', () => {
    const resultado = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/login');
  });

  it('authGuard permite el acceso con sesión iniciada', () => {
    auth.login('cliente@correo.cl', 'Cliente123!');
    const resultado = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(resultado).toBeTrue();
  });

  it('adminGuard bloquea a un cliente y redirige a /login', () => {
    auth.login('cliente@correo.cl', 'Cliente123!');
    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/login');
  });

  it('adminGuard permite el acceso a un administrador', () => {
    auth.login('admin@mesaludica.cl', 'Admin123!');
    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(resultado).toBeTrue();
  });
});
