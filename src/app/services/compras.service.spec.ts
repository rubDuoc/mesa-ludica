import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComprasService, Compra } from './compras.service';
import { ItemCarrito } from './carrito.service';
import { Producto } from '../models/producto';
import { FIREBASE_DB_URL } from './firebase.config';

/** URL del nodo de compras en Firebase. */
const URL = `${FIREBASE_DB_URL}/compras.json`;

/** Producto e item de prueba reutilizados en los tests. */
const producto: Producto = {
  id: 'p-001', nombre: 'Catan', categoria: 'estrategia',
  precio: 30000, precio_antiguo: null, stock: 5, imagen: '', descripcion: ''
};
const items: ItemCarrito[] = [{ producto, cantidad: 2 }];

describe('ComprasService', () => {
  let service: ComprasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ComprasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('registra una compra (GET + PUT) y la asocia al usuario', () => {
    let creada: Compra | undefined;
    service.registrar('cliente@correo.cl', items, 60000).subscribe(c => (creada = c));
    httpMock.expectOne(URL).flush(null); // aún no hay compras
    const put = httpMock.expectOne(`${FIREBASE_DB_URL}/compras/c-001.json`);
    expect(put.request.method).toBe('PUT');
    put.flush({});

    const compras = service.comprasDe('cliente@correo.cl');
    expect(compras.length).toBe(1);
    expect(compras[0].total).toBe(60000);
    expect(creada?.id).toBe('c-001');
  });

  it('asigna ids correlativos a cada compra', () => {
    let c1: Compra | undefined;
    service.registrar('a@correo.cl', items, 1).subscribe(c => (c1 = c));
    httpMock.expectOne(URL).flush(null);
    httpMock.expectOne(`${FIREBASE_DB_URL}/compras/c-001.json`).flush({});

    let c2: Compra | undefined;
    service.registrar('a@correo.cl', items, 1).subscribe(c => (c2 = c));
    httpMock.expectOne(URL).flush({ 'c-001': c1 }); // ya existe c-001
    httpMock.expectOne(`${FIREBASE_DB_URL}/compras/c-002.json`).flush({});

    expect(c2?.id).toBe('c-002');
  });

  it('copia los items para no acoplarse al carrito original', () => {
    let compra: Compra | undefined;
    service.registrar('a@correo.cl', items, 60000).subscribe(c => (compra = c));
    httpMock.expectOne(URL).flush(null);
    httpMock.expectOne(`${FIREBASE_DB_URL}/compras/c-001.json`).flush({});

    expect(compra?.items).not.toBe(items);
    expect(compra?.items[0].cantidad).toBe(2);
  });

  it('cargarHistorial trae las compras desde Firebase y comprasDe filtra por usuario', () => {
    service.cargarHistorial().subscribe();
    httpMock.expectOne(URL).flush({
      'c-001': { id: 'c-001', email: 'x@correo.cl', fecha: '2026-01-01T10:00:00.000Z', items: [], total: 100 },
      'c-002': { id: 'c-002', email: 'y@correo.cl', fecha: '2026-01-02T10:00:00.000Z', items: [], total: 200 }
    });
    expect(service.comprasDe('x@correo.cl').length).toBe(1);
    expect(service.comprasDe('y@correo.cl').length).toBe(1);
    expect(service.comprasDe('z@correo.cl').length).toBe(0);
  });
});
