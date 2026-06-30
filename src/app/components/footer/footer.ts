import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * @description
 * Pie de página de la aplicación. Muestra el aviso de copyright y un enlace
 * para volver al inicio. Se reutiliza en todas las páginas desde el componente raíz.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html'
})
export class Footer {}
