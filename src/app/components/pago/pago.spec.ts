import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pago } from './pago';
import { CarritoService } from '../../services/carrito.service';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto';

/** Producto de prueba con stock suficiente. */
const producto: Producto = {
  id: 'p-001', nombre: 'Catan', categoria: 'estrategia',
  precio: 30000, precio_antiguo: null, stock: 5, imagen: '', descripcion: ''
};

describe('Pago', () => {
  let component: Pago;
  let carrito: CarritoService;
  let compras: ComprasService;
  let auth: AuthService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Pago],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    carrito = TestBed.inject(CarritoService);
    compras = TestBed.inject(ComprasService);
    auth = TestBed.inject(AuthService);
    auth.login('cliente@correo.cl', 'Cliente123!');

    const fixture = TestBed.createComponent(Pago);
    component = fixture.componentInstance;
  });

  it('no registra nada si el carrito está vacío', () => {
    component.pagar();
    expect(component.pagado).toBeFalse();
    expect(compras.comprasDe('cliente@correo.cl').length).toBe(0);
  });

  it('registra la compra del usuario y vacía el carrito al pagar', () => {
    carrito.agregar(producto);
    carrito.agregar(producto);

    component.pagar();

    expect(component.pagado).toBeTrue();
    expect(component.totalPagado).toBe(60000);
    expect(carrito.totalItems()).toBe(0);
    expect(compras.comprasDe('cliente@correo.cl').length).toBe(1);
  });
});
