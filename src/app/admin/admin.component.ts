import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { AuthActions } from "../state/auth/auth.actions";

@Component({
  selector: "admin-component",
  templateUrl: "admin.component.html",
})
export class AdminComponent implements OnInit {
  userProfile: KeycloakProfile | null = null;
  public isLoggedIn = false;
  constructor(
    private keycloak: KeycloakService,
    private router: Router,
    private store: Store
  ) {}
  async ngOnInit() {
    // Check if the user is logged in
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    // If not logged in, redirect user
    if (!this.isLoggedIn) {
      this.router.navigateByUrl("/");
      // If logged in, load user profile and dispatch action to update user info
    } else {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.store.dispatch(
        AuthActions.updateKeycloakUserInfo({ keycloakUser: this.userProfile })
      );
    }
  }
}
