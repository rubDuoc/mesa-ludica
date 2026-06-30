import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { CategoriaPage } from './components/categoria/categoria';
import { Detalle } from './components/detalle/detalle';
import { Registro } from './components/registro/registro';
import { Login } from './components/login/login';
import { Recuperar } from './components/recuperar/recuperar';
import { Perfil } from './components/perfil/perfil';
import { Admin } from './components/admin/admin';
import { Carrito } from './components/carrito/carrito';
import { Pago } from './components/pago/pago';
import { MisCompras } from './components/mis-compras/mis-compras';
import { authGuard, adminGuard } from './guards/auth.guard';

/**
 * @description
 * Tabla de rutas de la aplicación. Define las páginas y aplica guards de
 * acceso: `perfil`, `pago` y `mis-compras` requieren sesión iniciada, y
 * `admin` requiere rol admin.
 */
export const routes: Routes = [
  { path: 'inicio',            component: Inicio },
  { path: 'categoria/:nombre', component: CategoriaPage },
  { path: 'detalle/:id',       component: Detalle },
  { path: 'registro',          component: Registro },
  { path: 'login',             component: Login },
  { path: 'recuperar',         component: Recuperar },
  { path: 'carrito',           component: Carrito },
  { path: 'perfil',            component: Perfil,     canActivate: [authGuard] },
  { path: 'pago',              component: Pago,       canActivate: [authGuard] },
  { path: 'mis-compras',       component: MisCompras, canActivate: [authGuard] },
  { path: 'admin',             component: Admin,      canActivate: [adminGuard] },
  { path: '',  redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];
