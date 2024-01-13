import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";
import { getCurrentUser } from "../../../app/state/auth/auth.selectors";
import { UserPayload } from "../../../app/models/user.model";
import { UserActions } from "../../../app/state/users/users.actions";

@Component({
  selector: "comping-nav",
  templateUrl: "nav.component.html",
})
export class NavComponent {
  profile: Observable<UserPayload | null>;
  constructor(public keycloak: KeycloakService, private store: Store) {
    this.profile = this.store.select(getCurrentUser);
  }

  logout() {
    this.keycloak.logout(window.location.origin);
  }

  downloadPDF() {
    this.store.dispatch(UserActions.downloadPdf());
  }
}
