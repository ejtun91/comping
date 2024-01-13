import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { getShowLoadingSpinner } from "./state/app.selectors";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "comping-task";
  showLoadingSpinner$?: Observable<boolean>;

  constructor(private store: Store, private keycloak: KeycloakService) {
    this.keycloak.loadUserProfile();
  }
  ngOnInit(): void {
    this.showLoadingSpinner$ = this.store.select(getShowLoadingSpinner);
  }
}
