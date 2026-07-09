import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Valida si existe un usuario autenticado antes de permitir el acceso a una ruta protegida.
   *
   * Si no existe una sesión activa, redirige al login.
   *
   * @returns Observable con el resultado de la validación.
 */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }

        return this.router.createUrlTree(['/login']);
      })
    );
  }
}