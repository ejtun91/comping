import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(router: Router, protected readonly keycloak: KeycloakService) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let authenticated = this.keycloak.getKeycloakInstance().authenticated;
    if (!authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + "/admin",
      });
      return true;
    }
    if (authenticated) {
      this.router.navigateByUrl("/admin");
      return true;
    }
    return false;
  }
}
