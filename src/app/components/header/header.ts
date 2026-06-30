import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Encabezado de la aplicación. Muestra el logo, el menú de navegación y el
 * contador del carrito. El menú se adapta a la sesión: cambia entre
 * "Iniciar sesión / Registrarse" y "Mi perfil / Cerrar sesión", y muestra
 * "Administración" solo a los usuarios con rol admin.
 *
 * @usageNotes
 * Se usa una sola vez en el componente raíz mediante `<app-header>`, por lo
 * que el menú queda disponible en todas las páginas.
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  /** Servicio del carrito, inyectado para mostrar el contador en la navbar. */
  protected readonly carrito = inject(CarritoService);

  /** Servicio de autenticación, para adaptar el menú a la sesión y el rol. */
  protected readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  /** Cierra la sesión actual y vuelve al inicio. */
  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/inicio']);
  }
}
