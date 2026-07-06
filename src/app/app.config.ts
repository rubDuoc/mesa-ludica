import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ProductoService } from './services/producto.service';

/**
 * @description
 * Configuración global de la aplicación: registra los proveedores raíz.
 * Incluye el enrutador, `HttpClient` para consumir el catálogo desde el
 * archivo JSON, y un inicializador que precarga ese catálogo antes de
 * arrancar para que las páginas dispongan de los datos desde el primer render.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => inject(ProductoService).cargarCatalogo())
  ]
};
