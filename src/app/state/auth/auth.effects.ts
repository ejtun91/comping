import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from "rxjs/operators";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AuthActions } from "./auth.actions";
import {
  hideLoadingSpinner,
  setErrorMessage,
  showLoadingSpinner,
} from "../app.actions";
import { Roles } from "../../models/auth-response.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  // login effect if no KEYCLOAK MODULE --LEGACY
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginStart),
      exhaustMap(({ username, password }) => {
        this.store.dispatch(showLoadingSpinner());

        return this.authService.login(username, password).pipe(
          switchMap((loginResponse: any) => {
            this.router.navigate(["/admin"]);

            return [
              AuthActions.loginStartSuccess({ response: loginResponse }),
              AuthActions.updateCurrentUser({ currentUser: loginResponse }),
            ];
          }),
          tap(() => this.store.dispatch(hideLoadingSpinner())),
          catchError((err: any) => {
            setErrorMessage({ message: err.error.error_description });
            if (err)
              this._snackBar.open(
                err.error.error_description || "Login Failed",
                "Close",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                }
              );
            return of(err);
          })
        );
      })
    );
  });

  // refresh token effect if no KEYCLOAK MODULE --LEGACY
  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshTokenStart),
      exhaustMap(() => {
        return this.authService.refreshToken().pipe(
          switchMap((res: any) => {
            return [
              AuthActions.refreshTokenSuccess({ response: res }),
              AuthActions.updateCurrentUser({ currentUser: res }),
            ];
          })
        );
      })
    );
  });
  // handle effect for roles
  getRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getUserRoles),
      mergeMap(({ userId }) => {
        this.store.dispatch(showLoadingSpinner());
        return this.authService.getUserRoles(userId).pipe(
          map((roles: Roles[]) => {
            this.store.dispatch(hideLoadingSpinner());
            return AuthActions.getUserRolesSuccess({ roles });
          })
        );
      })
    );
  });

  // handle effect for view roles
  getViewRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getUserViewRoles),
      mergeMap(({ userId }) => {
        this.store.dispatch(showLoadingSpinner());
        return this.authService.getUserRoles(userId).pipe(
          map((roles: Roles[]) => {
            this.store.dispatch(hideLoadingSpinner());
            return AuthActions.getUserViewRolesSuccess({ roles });
          })
        );
      })
    );
  });
  // logout effect if no KEYCLOAK MODULE --LEGACY
  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logOut),
        map(() => {
          this.authService.logout();
          this.router.navigate(["/login"]);
        })
      );
    },
    { dispatch: false }
  );
}
