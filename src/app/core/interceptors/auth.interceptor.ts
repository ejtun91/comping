import { HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable, mergeMap, of } from "rxjs";
import { KeycloakService } from "keycloak-angular";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private keycloak: KeycloakService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return of(this.authService.getToken()).pipe(
      mergeMap((token) => {
        if (this.keycloak.isTokenExpired()) {
          this.keycloak.updateToken();
        }
        return next.handle(req);
      })
    );
  }
  /*** WITHOUT KEYCLOAK MODULE -- LEGACY ***/
  // intercept(
  // 	req: HttpRequest<any>,
  // 	next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  // 	return this.store.select(getToken).pipe(
  // 		first(),
  // 		mergeMap((token) => {
  // 			const authReq = !!token
  // 				? req.clone({
  // 						setHeaders: { Authorization: 'Bearer ' + token },
  // 				  })
  // 				: req;
  // 			return next.handle(authReq);
  // 		})
  // 	);
  // }
}
