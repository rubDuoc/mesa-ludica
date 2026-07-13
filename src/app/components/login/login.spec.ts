import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Login } from './login';
import { Usuario } from '../../models/usuario';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** URL del nodo de usuarios en Firebase. */
const URL = `${FIREBASE_DB_URL}/usuarios.json`;

/** Usuarios simulados que devuelve Firebase en las pruebas. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: '', rol: 'cliente' }
};

describe('Login', () => {
  let component: Login;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('el formulario es inválido cuando está vacío', () => {
    component.iniciarSesion();
    expect(component.formulario.valid).toBeFalse();
  });

  it('marca credenciales inválidas con datos incorrectos', () => {
    component.formulario.setValue({ email: 'noexiste@correo.cl', contrasena: 'cualquiera' });
    component.iniciarSesion();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(component.credencialesInvalidas).toBeTrue();
  });

  it('redirige al inicio con credenciales válidas', () => {
    const navegar = spyOn(router, 'navigate');
    component.formulario.setValue({ email: 'cliente@correo.cl', contrasena: 'Cliente123!' });
    component.iniciarSesion();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(component.credencialesInvalidas).toBeFalse();
    expect(navegar).toHaveBeenCalledWith(['/inicio']);
  });
});
