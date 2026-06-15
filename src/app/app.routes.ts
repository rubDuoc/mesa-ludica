import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Categoria } from './components/categoria/categoria';
import { Detalle } from './components/detalle/detalle';
import { Registro } from './components/registro/registro';

export const routes: Routes = [
  { path: 'inicio',            component: Inicio },
  { path: 'categoria/:nombre', component: Categoria },
  { path: 'detalle/:id',       component: Detalle },
  { path: 'registro',          component: Registro },
  { path: '',  redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];
