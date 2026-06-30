import { TestBed } from '@angular/core/testing';
import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil]
    }).compileComponents();

    const fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('viene precargado con los datos actuales y es válido', () => {
    expect(component.formulario.valid).toBeTrue();
    expect(component.nombre.value).toBe('Rubén Oyarzún');
  });

  it('rechaza un teléfono que no sean 8 o 9 dígitos', () => {
    component.telefono.setValue('abc123');
    expect(component.telefono.valid).toBeFalse();
  });

  it('restablecer vuelve a los datos originales', () => {
    component.nombre.setValue('Otro Nombre');
    component.restablecer();
    expect(component.nombre.value).toBe('Rubén Oyarzún');
  });
});
