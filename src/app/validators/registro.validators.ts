/* ============================================================
   Mesa Lúdica - Validadores personalizados del registro
   DSY2202 - Experiencia 2, Semana 5

   Funciones puras de validación para el formulario reactivo.
   Al estar separadas del componente son fáciles de reutilizar
   y de probar con pruebas unitarias.
   ============================================================ */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description
 * Valida la fuerza de la contraseña: debe incluir al menos un número, una
 * mayúscula y un carácter especial. El largo (6-18) se valida aparte con
 * Validators.minLength/maxLength.
 * @param control Control del campo contraseña.
 * @returns `{ fuerza: true }` si no cumple, o `null` si es válida.
 */
export function fuerzaContrasena(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value || '';
  if (!valor) {
    return null; // el vacío lo controla Validators.required
  }
  const tieneNumero = /[0-9]/.test(valor);
  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneEspecial = /[^A-Za-z0-9]/.test(valor);
  return tieneNumero && tieneMayuscula && tieneEspecial ? null : { fuerza: true };
}

/**
 * @description
 * Crea un validador que exige una edad mínima calculada con la fecha exacta
 * de nacimiento.
 * @param minimo Edad mínima requerida en años.
 * @returns Una función validadora que devuelve `{ menorDeEdad: true }` si no cumple.
 */
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

/**
 * @description
 * Valida que las dos contraseñas coincidan. Se aplica a nivel de FormGroup
 * porque necesita comparar dos controles entre sí (`contrasena` y `confirmarContrasena`).
 * @param group FormGroup que contiene ambos controles.
 * @returns `{ contrasenasDistintas: true }` si difieren, o `null` si coinciden.
 */
export function contrasenasIguales(group: AbstractControl): ValidationErrors | null {
  const contrasena = group.get('contrasena')?.value;
  const confirmar = group.get('confirmarContrasena')?.value;
  if (!confirmar) {
    return null; // aún no escribe la confirmación
  }
  return contrasena === confirmar ? null : { contrasenasDistintas: true };
}
