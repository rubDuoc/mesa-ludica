import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Usuario } from '../models/usuario';
import { FIREBASE_DB_URL } from './firebase.config';

/** URL del nodo de usuarios en Firebase. */
const URL = `${FIREBASE_DB_URL}/usuarios.json`;

/** Usuarios simulados tal como los devuelve Firebase: objeto indexado por id. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-001': { id: 'u-001', nombre: 'Administrador', usuario: 'admin', email: 'admin@mesaludica.cl', password: 'Admin123!', telefono: '900000000', direccion: 'Oficina central', rol: 'admin' },
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: 'Av. Siempre Viva 742', rol: 'cliente' }
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('inicia sin sesión activa', () => {
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('inicia sesión con credenciales válidas de admin (GET a Firebase)', () => {
    let ok = false;
    service.login('admin@mesaludica.cl', 'Admin123!').subscribe(r => (ok = r));
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(ok).toBeTrue();
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeTrue();
  });

  it('rechaza credenciales inválidas', () => {
    let ok = true;
    service.login('admin@mesaludica.cl', 'claveincorrecta').subscribe(r => (ok = r));
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(ok).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('un cliente autenticado no es administrador', () => {
    service.login('cliente@correo.cl', 'Cliente123!').subscribe();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
  });

  it('logout cierra la sesión', () => {
    service.login('cliente@correo.cl', 'Cliente123!').subscribe();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    service.logout();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('registra un usuario nuevo (PUT con id correlativo) y queda con sesión', () => {
    service.registrar({ nombre: 'Nuevo', email: 'nuevo@correo.cl', password: 'Clave123!' }).subscribe();
    // 1) GET para validar que el correo no existe.
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    // 2) PUT del nuevo usuario con id correlativo u-003.
    const req = httpMock.expectOne(`${FIREBASE_DB_URL}/usuarios/u-003.json`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
    expect(service.usuario()?.email).toBe('nuevo@correo.cl');
  });

  it('avisa si el correo ya está registrado y no crea sesión', () => {
    let error: Error | undefined;
    service.registrar({ nombre: 'Dup', email: 'cliente@correo.cl', password: 'Clave123!' })
      .subscribe({ error: e => (error = e) });
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(error?.message).toBe('EMAIL_EXISTENTE');
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('recupera la sesión guardada en localStorage al iniciar', () => {
    // Simulamos una sesión previamente persistida.
    localStorage.setItem('ml_sesion', JSON.stringify(USUARIOS_MOCK['u-002']));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    const recreado = TestBed.inject(AuthService);
    expect(recreado.estaAutenticado()).toBeTrue();
    expect(recreado.usuario()?.email).toBe('cliente@correo.cl');
  });
});
