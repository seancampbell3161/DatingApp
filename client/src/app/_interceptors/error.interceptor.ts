import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          console.log(`general hit: ${error}`);
          switch (error.status) {
            case 400:
              // flatten the array of errors we get back from our validation responses, & push them into an array
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) { // looping thru the properties of the error.error object
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              } else {
                this.toastr.error(error.error, error.status);
              }
              break;

            case 401:
              this.toastr.error(error.statusText === "OK" ? "Unauthorized" : error.statusText, error.status);
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            
            case 500:
              console.log(`500 hit: ${error}`);
              const navigationExtras: NavigationExtras = { state: {error: error.error} };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
