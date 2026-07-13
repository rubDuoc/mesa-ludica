import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CatalogoApi } from './catalogo-api';
import { Producto } from '../../models/producto';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** Base de la Realtime Database usada para verificar la URL de la petición. */
const BASE = FIREBASE_DB_URL;

/** Catálogo simulado tal como lo devuelve Firebase: objeto indexado por id. */
const MOCK: Record<string, Producto> = {
  'p-001': { id: 'p-001', nombre: 'Catan', categoria: 'estrategia', precio: 31990, precio_antiguo: 39990, stock: 12, imagen: 'img/CATAN.jpg', descripcion: 'a' },
  'p-002': { id: 'p-002', nombre: 'UNO',   categoria: 'cartas',     precio: 5390,  precio_antiguo: null,  stock: 30, imagen: 'img/UNO.jpg',   descripcion: 'b' }
};

describe('CatalogoApi', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CatalogoApi],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('se suscribe a Firebase (GET) y muestra los productos en la tabla', () => {
    const fixture = TestBed.createComponent(CatalogoApi);
    fixture.detectChanges(); // dispara ngOnInit

    const req = httpMock.expectOne(`${BASE}/productos.json`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK);
    fixture.detectChanges();

    expect(fixture.componentInstance.productos.length).toBe(2);
    expect(fixture.componentInstance.cargando).toBeFalse();
    const filas = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(filas.length).toBe(2);
  });

  it('muestra el estado de error cuando la petición falla', () => {
    const fixture = TestBed.createComponent(CatalogoApi);
    fixture.detectChanges();

    httpMock.expectOne(`${BASE}/productos.json`)
      .flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.componentInstance.error).toBeTrue();
    expect(fixture.componentInstance.cargando).toBeFalse();
  });
});
