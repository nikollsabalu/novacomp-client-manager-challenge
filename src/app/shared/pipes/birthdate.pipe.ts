import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthDate'
})
export class BirthDatePipe implements PipeTransform {

  /**
   * Formatea una fecha de nacimiento según la configuración regional y el formato especificado.
   *
   * @param value Fecha a formatear.
   * @param locale Configuración regional (por defecto es-PE).
   * @param format Formato del mes ('short' o 'long').
   * @returns Fecha formateada o '-' cuando el valor es inválido.
   */
  transform(
    value: Date | string | null | undefined,
    locale = 'es-PE',
    format: 'short' | 'long' = 'short'
  ): string {

    if (!value) return '-';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: format === 'short' ? 'short' : 'long',
      year: 'numeric'
    }).format(date);
  }

}