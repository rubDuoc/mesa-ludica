import { TestBed } from '@angular/core/testing';
import { ComprasService } from './compras.service';
import { ItemCarrito } from './carrito.service';
import { Producto } from '../models/producto';

/** Producto e item de prueba reutilizados en los tests. */
const producto: Producto = {
  id: 'p-001', nombre: 'Catan', categoria: 'estrategia',
  precio: 30000, precio_antiguo: null, stock: 5, imagen: '', descripcion: ''
};
const items: ItemCarrito[] = [{ producto, cantidad: 2 }];

describe('ComprasService', () => {
  let service: ComprasService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasService);
  });

  it('registra una compra y la asocia al usuario', () => {
    service.registrar('cliente@correo.cl', items, 60000);
    const compras = service.comprasDe('cliente@correo.cl');
    expect(compras.length).toBe(1);
    expect(compras[0].total).toBe(60000);
  });

  it('comprasDe devuelve solo las compras del usuario indicado', () => {
    service.registrar('a@correo.cl', items, 60000);
    service.registrar('b@correo.cl', items, 60000);
    expect(service.comprasDe('a@correo.cl').length).toBe(1);
    expect(service.comprasDe('b@correo.cl').length).toBe(1);
  });

  it('asigna ids correlativos a cada compra', () => {
    const c1 = service.registrar('a@correo.cl', items, 1);
    const c2 = service.registrar('a@correo.cl', items, 1);
    expect(c2.id).toBe(c1.id + 1);
  });

  it('copia los items para no acoplarse al carrito original', () => {
    const compra = service.registrar('a@correo.cl', items, 60000);
    expect(compra.items).not.toBe(items);
    expect(compra.items[0].cantidad).toBe(2);
  });

  it('carga el historial guardado en localStorage y continúa el correlativo', () => {
    localStorage.setItem('ml_compras', JSON.stringify([
      { id: 5, email: 'x@correo.cl', fecha: new Date(), items: [], total: 100 }
    ]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const recreado = TestBed.inject(ComprasService);

    expect(recreado.comprasDe('x@correo.cl').length).toBe(1);
    const nueva = recreado.registrar('x@correo.cl', items, 1);
    expect(nueva.id).toBe(6);
  });
});
