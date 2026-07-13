import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Pago } from './pago';
import { CarritoService } from '../../services/carrito.service';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto';
import { Usuario } from '../../models/usuario';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** Producto de prueba con stock suficiente. */
const producto: Producto = {
  id: 'p-001', nombre: 'Catan', categoria: 'estrategia',
  precio: 30000, precio_antiguo: null, stock: 5, imagen: '', descripcion: ''
};

/** Usuarios simulados que devuelve Firebase para el login. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: '', rol: 'cliente' }
};

describe('Pago', () => {
  let component: Pago;
  let carrito: CarritoService;
  let compras: ComprasService;
  let auth: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Pago],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    carrito = TestBed.inject(CarritoService);
    compras = TestBed.inject(ComprasService);
    auth = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    // Iniciamos sesión (login consulta Firebase) antes de operar el pago.
    auth.login('cliente@correo.cl', 'Cliente123!').subscribe();
    httpMock.expectOne(`${FIREBASE_DB_URL}/usuarios.json`).flush(USUARIOS_MOCK);

    const fixture = TestBed.createComponent(Pago);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('no registra nada si el carrito está vacío', () => {
    component.pagar();
    expect(component.pagado).toBeFalse();
    expect(compras.comprasDe('cliente@correo.cl').length).toBe(0);
  });

  it('registra la compra del usuario (GET + PUT) y vacía el carrito al pagar', () => {
    carrito.agregar(producto);
    carrito.agregar(producto);

    component.pagar();

    // El registro consulta el historial y luego escribe la nueva compra.
    httpMock.expectOne(`${FIREBASE_DB_URL}/compras.json`).flush(null);
    const put = httpMock.expectOne(`${FIREBASE_DB_URL}/compras/c-001.json`);
    expect(put.request.method).toBe('PUT');
    put.flush({});

    expect(component.pagado).toBeTrue();
    expect(component.totalPagado).toBe(60000);
    expect(carrito.totalItems()).toBe(0);
    expect(compras.comprasDe('cliente@correo.cl').length).toBe(1);
  });
});
