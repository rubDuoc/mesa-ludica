import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MisCompras } from './mis-compras';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { Compra } from '../../services/compras.service';
import { FIREBASE_DB_URL } from '../../services/firebase.config';

/** URLs de los nodos usados en la prueba. */
const USUARIOS_URL = `${FIREBASE_DB_URL}/usuarios.json`;
const COMPRAS_URL = `${FIREBASE_DB_URL}/compras.json`;

/** Usuario que inicia sesión en la prueba. */
const USUARIOS_MOCK: Record<string, Usuario> = {
  'u-002': { id: 'u-002', nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl', password: 'Cliente123!', telefono: '912345678', direccion: '', rol: 'cliente' }
};

/** Historial simulado con compras de dos usuarios distintos. */
const COMPRAS_MOCK: Record<string, Compra> = {
  'c-001': { id: 'c-001', email: 'cliente@correo.cl', fecha: '2026-01-01T10:00:00.000Z', items: [], total: 5000 },
  'c-002': { id: 'c-002', email: 'otro@correo.cl', fecha: '2026-01-02T10:00:00.000Z', items: [], total: 9000 }
};

describe('MisCompras', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MisCompras],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const auth = TestBed.inject(AuthService);
    auth.login('cliente@correo.cl', 'Cliente123!').subscribe();
    httpMock.expectOne(USUARIOS_URL).flush(USUARIOS_MOCK);
  });

  afterEach(() => httpMock.verify());

  it('carga el historial y muestra solo las compras del usuario logueado', () => {
    const fixture = TestBed.createComponent(MisCompras);
    fixture.detectChanges(); // dispara ngOnInit → GET compras

    httpMock.expectOne(COMPRAS_URL).flush(COMPRAS_MOCK);
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBeFalse();
    expect(fixture.componentInstance.misCompras.length).toBe(1);
    expect(fixture.componentInstance.misCompras[0].email).toBe('cliente@correo.cl');
  });
});
