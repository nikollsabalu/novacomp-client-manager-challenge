import { Pipe, PipeTransform } from '@angular/core';

type FirestoreTimestampLike = {
  seconds: number;
  nanoseconds: number;
};

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
    value: Date | string | FirestoreTimestampLike | null | undefined,
    locale = 'es-PE',
    format: 'short' | 'long' = 'short'
  ): string {
    if (!value) return '-';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'object' && 'seconds' in value) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: format === 'short' ? 'short' : 'long',
      year: 'numeric'
    }).format(date);
  }
}

