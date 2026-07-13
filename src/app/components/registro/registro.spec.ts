import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Registro } from './registro';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** URL del nodo de usuarios en Firebase. */
const URL = `${FIREBASE_DB_URL}/usuarios.json`;

/** Usuarios simulados que devuelve Firebase en las pruebas. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: '', rol: 'cliente' }
};

/** Devuelve datos válidos de registro, con el correo que se indique. */
function datosValidos(email: string) {
  const hoy = new Date();
  const hace20 = new Date(hoy.getFullYear() - 20, hoy.getMonth(), hoy.getDate());
  return {
    nombre: 'Persona Prueba',
    usuario: 'prueba',
    email,
    contrasena: 'Clave123!',
    confirmarContrasena: 'Clave123!',
    nacimiento: hace20.toISOString().substring(0, 10),
    direccion: ''
  };
}

describe('Registro (formulario reactivo)', () => {
  let component: Registro;
  let auth: AuthService;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Registro, ReactiveFormsModule],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    const fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario es inválido cuando está vacío', () => {
    expect(component.formulario.valid).toBeFalse();
  });

  it('detecta cuando las contraseñas no coinciden', () => {
    component.formulario.patchValue({
      contrasena: 'Clave123',
      confirmarContrasena: 'Otra456'
    });
    expect(component.formulario.errors?.['contrasenasDistintas']).toBeTrue();
  });

  it('rechaza una persona menor de 13 años', () => {
    const hoy = new Date();
    const hace10 = new Date(hoy.getFullYear() - 10, hoy.getMonth(), hoy.getDate());
    component.nacimiento.setValue(hace10.toISOString().substring(0, 10));
    expect(component.nacimiento.errors?.['menorDeEdad']).toBeTrue();
  });

  it('rechaza una contraseña sin número, mayúscula ni carácter especial', () => {
    component.contrasena.setValue('claveinsegura');
    expect(component.contrasena.errors?.['fuerza']).toBeTrue();
  });

  it('marca el correo como inválido cuando el formato es incorrecto', () => {
    component.email.setValue('correo-sin-arroba');
    expect(component.email.errors?.['email']).toBeTrue();
  });

  it('limpiar() vacía el formulario y reinicia el estado de enviado', () => {
    component.formulario.patchValue({ nombre: 'Prueba', email: 'a@b.cl' });
    component.enviado = true;

    component.limpiar();

    expect(component.formulario.value.nombre).toBeNull();
    expect(component.formulario.value.email).toBeNull();
    expect(component.enviado).toBeFalse();
  });

  it('acepta el formulario cuando todos los datos son válidos', () => {
    component.formulario.setValue(datosValidos('ruben@correo.cl'));
    expect(component.formulario.valid).toBeTrue();
  });

  it('registra un correo nuevo (GET + PUT), inicia sesión y redirige al inicio', () => {
    const navegar = spyOn(router, 'navigate');
    component.formulario.setValue(datosValidos('nuevo@correo.cl'));
    component.enviar();
    // 1) GET de validación de correo.
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    // 2) PUT del nuevo usuario con id correlativo u-003.
    const put = httpMock.expectOne(`${FIREBASE_DB_URL}/usuarios/u-003.json`);
    expect(put.request.method).toBe('PUT');
    put.flush({});
    expect(component.emailExistente).toBeFalse();
    expect(auth.estaAutenticado()).toBeTrue();
    expect(navegar).toHaveBeenCalledWith(['/inicio']);
  });

  it('avisa si el correo ya está registrado y no crea sesión', () => {
    spyOn(router, 'navigate');
    component.formulario.setValue(datosValidos('cliente@correo.cl')); // cuenta demo existente
    component.enviar();
    httpMock.expectOne(URL).flush(USUARIOS_MOCK);
    expect(component.emailExistente).toBeTrue();
    expect(auth.estaAutenticado()).toBeFalse();
  });
});
