/* ============================================================
   Mesa Lúdica - Validadores personalizados del registro
   DSY2202 - Experiencia 2, Semana 5

   Funciones puras de validación para el formulario reactivo.
   Al estar separadas del componente son fáciles de reutilizar
   y de probar con pruebas unitarias.
   ============================================================ */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/* La contraseña debe incluir al menos un número y al menos una mayúscula.
   El largo (6-18) se valida aparte con Validators.minLength/maxLength. */
export function fuerzaContrasena(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value || '';
  if (!valor) {
    return null; // el vacío lo controla Validators.required
  }
  const tieneNumero = /[0-9]/.test(valor);
  const tieneMayuscula = /[A-Z]/.test(valor);
  return tieneNumero && tieneMayuscula ? null : { fuerza: true };
}

/* Exige una edad mínima calculada con la fecha exacta de nacimiento. */
export function edadMinima(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const nacimiento = new Date(control.value);
    if (isNaN(nacimiento.getTime())) {
      return null;
    }
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    // Resta un año si todavía no ha cumplido años este año.
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= minimo ? null : { menorDeEdad: true };
  };
}

/* Las dos contraseñas deben coincidir. Se aplica a nivel de FormGroup
   porque necesita comparar dos controles entre sí. */
export function contrasenasIguales(group: AbstractControl): ValidationErrors | null {
  const contrasena = group.get('contrasena')?.value;
  const confirmar = group.get('confirmarContrasena')?.value;
  if (!confirmar) {
    return null; // aún no escribe la confirmación
  }
  return contrasena === confirmar ? null : { contrasenasDistintas: true };
}
