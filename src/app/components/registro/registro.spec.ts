import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Registro } from './registro';

describe('Registro (formulario reactivo)', () => {
  let component: Registro;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registro, ReactiveFormsModule]
    }).compileComponents();

    const fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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

  it('rechaza una contraseña sin número ni mayúscula', () => {
    component.contrasena.setValue('claveinsegura');
    expect(component.contrasena.errors?.['fuerza']).toBeTrue();
  });

  it('acepta el formulario cuando todos los datos son válidos', () => {
    const hoy = new Date();
    const hace20 = new Date(hoy.getFullYear() - 20, hoy.getMonth(), hoy.getDate());
    component.formulario.setValue({
      nombre: 'Rubén Oyarzún',
      usuario: 'ruben',
      email: 'ruben@correo.cl',
      contrasena: 'Clave123',
      confirmarContrasena: 'Clave123',
      nacimiento: hace20.toISOString().substring(0, 10),
      direccion: ''  // opcional, puede ir vacío
    });
    expect(component.formulario.valid).toBeTrue();
  });
});
