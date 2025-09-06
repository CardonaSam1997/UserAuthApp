import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(req).pipe(
      catchError((error: any) => {
        // Network error o API no disponible
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            console.warn('Servidor no disponible o conexión rechazada', error);
            this.router.navigate(['/error'], { state: { message: 'Servidor no disponible' } });
          } else if (error.status >= 500) {
            this.router.navigate(['/error'], { state: { message: 'Error en el servidor' } });
          } else if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            const errMsg = error.error?.message || 'Ocurrió un error inesperado.';
            alert(errMsg);
          }
        } else {
          // Error no HTTP (network, CORS, etc.)
          console.error('Error inesperado', error);
          this.router.navigate(['/error'], { state: { message: 'Servidor no disponible' } });
        }

        return throwError(() => error);
      })
    );
  }
}
