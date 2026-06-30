import { TestBed } from '@angular/core/testing';
import { Perfil } from './perfil';
import { AuthService } from '../../services/auth.service';

describe('Perfil', () => {
  let component: Perfil;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil]
    }).compileComponents();

    // El perfil se precarga con el usuario logueado: iniciamos sesión antes.
    const auth = TestBed.inject(AuthService);
    auth.login('cliente@correo.cl', 'Cliente123!');

    const fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('viene precargado con los datos del usuario logueado y es válido', () => {
    expect(component.formulario.valid).toBeTrue();
    expect(component.nombre.value).toBe('Cliente Demo');
    expect(component.email.value).toBe('cliente@correo.cl');
  });

  it('rechaza un teléfono que no sean 8 o 9 dígitos', () => {
    component.telefono.setValue('abc123');
    expect(component.telefono.valid).toBeFalse();
  });

  it('guardar actualiza los datos del usuario en la sesión', () => {
    const auth = TestBed.inject(AuthService);
    component.nombre.setValue('Cliente Editado');
    component.guardar();
    expect(component.guardado).toBeTrue();
    expect(auth.usuario()?.nombre).toBe('Cliente Editado');
  });

  it('restablecer vuelve a los datos originales del usuario', () => {
    component.nombre.setValue('Otro Nombre');
    component.restablecer();
    expect(component.nombre.value).toBe('Cliente Demo');
  });
});
