import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, takeUntil } from "rxjs";
import { UserPayload } from "../../../models/user.model";
import { Store } from "@ngrx/store";
import { getAllUsers } from "../../../state/users/users.selectors";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import {
  getCurrentUser,
  isAdmin,
  isManager,
} from "../../../state/auth/auth.selectors";
import { KeycloakProfile } from "keycloak-js";
import { environment } from "../../../../environments/environment";
import { AuthActions } from "../../../state/auth/auth.actions";
import {
  injectDestroyService,
  provideDestroyService,
} from "../../../core/unsubscribe/unsubscribe.service";
import { CurrentUser } from "../../../models/current-user.model";

@Component({
  selector: "comping-users",
  templateUrl: "users.component.html",
  providers: [provideDestroyService()], // Using an unsubscribe service to manage subscriptions
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ["username", "email", "firstName", "lastName"];
  users$: Observable<UserPayload[] | undefined>;
  dataSource: MatTableDataSource<UserPayload> | null = null;
  isAdmin$: Observable<boolean | undefined>;
  isManager$: Observable<boolean | undefined>;
  currentUser$: Observable<UserPayload | null>;

  regularUser = false;
  @ViewChild(MatSort) sort!: MatSort;

  // Service for managing component destruction lifecycle
  private readonly destroy$ = injectDestroyService();

  constructor(
    private store: Store,
    private router: Router,
    private keycloak: KeycloakService
  ) {
    // Initialize observables for user data and roles
    this.users$ = this.store.select(getAllUsers);
    this.isAdmin$ = this.store.select(isAdmin);
    this.isManager$ = this.store.select(isManager);
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  ngOnInit(): void {
    // Subscribe to the users observable and update the data source
    this.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      if (users) {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.data = [...users];
      }
    });

    // Check if the user is a regular user or a manager
    this.regularUser =
      !this.keycloak
        .getUserRoles()
        .includes(environment.keycloak.managerRole) &&
      !this.keycloak.getUserRoles().includes(environment.keycloak.adminRole);
  }

  // Lifecycle hook called after the view is initialized
  ngAfterViewInit() {
    this.dataSource!.sort = this.sort;
  }

  // Handle row click event and navigate to the user details page
  rowClickHandler(row: UserPayload) {
    this.router.navigateByUrl(`/admin/${row.id}`);
  }

  // Handle key event in the search input and filter the data source
  onKey(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();
  }
}
