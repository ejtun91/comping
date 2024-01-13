import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserActions } from "../../state/users/users.actions";
import { AuthActions } from "../../state/auth/auth.actions";
import { KeycloakService } from "keycloak-angular";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class UsersGuard implements CanActivate {
  constructor(private store: Store, private keycloak: KeycloakService) {}

  canActivate(): Observable<boolean> {
    // Retrieve the user ID from Keycloak
    const userId = this.keycloak.getKeycloakInstance().subject as string;

    // Check if the user has the manager role
    if (
      this.keycloak.getUserRoles().includes(environment.keycloak.managerRole) ||
      this.keycloak.getUserRoles().includes(environment.keycloak.adminRole)
    ) {
      // Dispatch actions to load users and get user roles
      this.store.dispatch(UserActions.loadUsers());
      this.store.dispatch(AuthActions.getUserRoles({ userId }));
    }

    // Return an observable that emits true (allow access) and completes
    return new Observable<boolean>((observer) => {
      observer.next(true);
      observer.complete();
    });
  }
}
