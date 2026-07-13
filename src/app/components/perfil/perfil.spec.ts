import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Perfil } from './perfil';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** URL del nodo de usuarios en Firebase. */
const URL = `${FIREBASE_DB_URL}/usuarios.json`;

/** Usuarios simulados que devuelve Firebase en las pruebas. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: 'Av. Siempre Viva 742', rol: 'cliente' }
};

describe('Perfil', () => {
  let component: Perfil;
  let auth: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    // El perfil se precarga con el usuario logueado: iniciamos sesión antes.
    auth.login('cliente@correo.cl', 'Cliente123!').subscribe();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);

    const fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('viene precargado con los datos del usuario logueado y es válido', () => {
    expect(component.formulario.valid).toBeTrue();
    expect(component.nombre.value).toBe('Cliente Demo');
    expect(component.email.value).toBe('cliente@correo.cl');
  });

  it('rechaza un teléfono que no sean 8 o 9 dígitos', () => {
    component.telefono.setValue('abc123');
    expect(component.telefono.valid).toBeFalse();
  });

  it('guardar actualiza los datos del usuario (PUT) en la sesión', () => {
    component.nombre.setValue('Cliente Editado');
    component.guardar();
    const req = httpMock.expectOne(`${FIREBASE_DB_URL}/usuarios/u-002.json`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    expect(component.guardado).toBeTrue();
    expect(auth.usuario()?.nombre).toBe('Cliente Editado');
  });

  it('restablecer vuelve a los datos originales del usuario', () => {
    component.nombre.setValue('Otro Nombre');
    component.restablecer();
    expect(component.nombre.value).toBe('Cliente Demo');
  });
});
