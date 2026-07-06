import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { Producto } from '../models/producto';

/** Producto de prueba reutilizado en los tests. */
const juego: Producto = {
  id: 'p-001',
  nombre: 'Catan',
  categoria: 'estrategia',
  precio: 30000,
  precio_antiguo: null,
  stock: 5,
  imagen: 'img/CATAN.jpg',
  descripcion: 'Juego de prueba'
};

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
  });

  it('agrega un producto y cuenta una unidad', () => {
    service.agregar(juego);
    expect(service.totalItems()).toBe(1);
  });

  it('agregar el mismo producto suma cantidad y total', () => {
    service.agregar(juego);
    service.agregar(juego);
    expect(service.totalItems()).toBe(2);
    expect(service.total()).toBe(60000);
  });

  it('decrementar hasta 0 quita el producto', () => {
    service.agregar(juego);
    service.decrementar('p-001');
    expect(service.contenido().length).toBe(0);
  });

  it('quitar elimina la línea del carrito', () => {
    service.agregar(juego);
    service.quitar('p-001');
    expect(service.contenido().length).toBe(0);
  });

  it('vaciar deja el carrito en cero', () => {
    service.agregar(juego);
    service.vaciar();
    expect(service.totalItems()).toBe(0);
  });

  it('no permite agregar más unidades que el stock disponible', () => {
    const limitado: Producto = { ...juego, id: 'p-099', stock: 2 };
    expect(service.agregar(limitado)).toBeTrue();  // 1
    expect(service.agregar(limitado)).toBeTrue();  // 2
    expect(service.agregar(limitado)).toBeFalse(); // supera el stock (2)
    expect(service.totalItems()).toBe(2);
  });

  it('incrementar no supera el stock disponible', () => {
    const limitado: Producto = { ...juego, id: 'p-098', stock: 1 };
    service.agregar(limitado);
    service.incrementar('p-098');
    expect(service.totalItems()).toBe(1);
  });
});
