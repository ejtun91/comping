import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { KeycloakService } from "keycloak-angular";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0 && error.statusText === "Unknown Error") {
            console.log(
              "Possible CORS issue. Check server CORS configuration."
            );
          } else if (error.status === 401) {
            this.keycloak.logout(window.location.origin);
          } else {
          }
        }

        window.scrollTo(0, 0);
        return throwError(error);
      })
    );
  }
}
