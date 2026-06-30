import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('el formulario es inválido cuando está vacío', () => {
    component.iniciarSesion();
    expect(component.formulario.valid).toBeFalse();
  });

  it('marca credenciales inválidas con datos incorrectos', () => {
    component.formulario.setValue({ email: 'noexiste@correo.cl', contrasena: 'cualquiera' });
    component.iniciarSesion();
    expect(component.credencialesInvalidas).toBeTrue();
  });

  it('redirige al inicio con credenciales válidas', () => {
    const navegar = spyOn(router, 'navigate');
    component.formulario.setValue({ email: 'cliente@correo.cl', contrasena: 'Cliente123!' });
    component.iniciarSesion();
    expect(component.credencialesInvalidas).toBeFalse();
    expect(navegar).toHaveBeenCalledWith(['/inicio']);
  });
});
