import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

/**
 * @description
 * Componente raíz de la aplicación. Arma el layout general: encabezado
 * reutilizable, área de rutas (`router-outlet`) y pie de página.
 *
 * @usageNotes
 * 1. Es el componente que se monta en `index.html` mediante `<app-root>`.
 * 2. Incluye `<app-header>` para el menú y `<app-footer>` para el pie.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Título de la aplicación. */
  protected readonly title = 'Mesa Lúdica';
}
