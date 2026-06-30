import { TestBed } from '@angular/core/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoService);
  });

  it('parte con los 12 productos del catálogo', () => {
    expect(service.totalProductos()).toBe(12);
  });

  it('agregar un producto aumenta el total', () => {
    service.agregarProducto({
      nombre: 'Nuevo juego',
      categoria: 'cartas',
      precio: 5000,
      precio_antiguo: null,
      stock: 3,
      imagen: 'img/nuevo.jpg',
      descripcion: 'Producto agregado en la prueba'
    });
    expect(service.totalProductos()).toBe(13);
  });

  it('eliminar un producto lo quita del catálogo', () => {
    service.eliminarProducto('p-001');
    expect(service.getProductoPorId('p-001')).toBeUndefined();
  });

  it('calcula el descuento de un producto en oferta', () => {
    const enOferta: Producto = {
      id: 'x', nombre: 'x', categoria: 'cartas', precio: 8000,
      precio_antiguo: 10000, stock: 1, imagen: '', descripcion: ''
    };
    expect(service.descuento(enOferta)).toBe(20);
  });

  it('formatea el precio al estilo chileno', () => {
    expect(service.formatearPrecio(31990)).toContain('31.990');
  });
});
