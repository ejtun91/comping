// Import necessary modules and components from Angular and external libraries
import { Component, OnInit } from "@angular/core";
import { ErrorUtil } from "../../../../shared/utils/error.util";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { UserActions } from "../../../state/users/users.actions";
import { Observable, delay, takeUntil } from "rxjs";
import { UserPayload } from "../../../models/user.model";
import { getUserById } from "../../../state/users/users.selectors";
import { ActivatedRoute } from "@angular/router";
import {
  getCurrentViewRoles,
  isAdmin,
  isManager,
} from "../../../state/auth/auth.selectors";
import { AuthActions } from "../../../state/auth/auth.actions";
import { environment as env } from "../../../../environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponentDialog } from "../../../../shared/components/modal/modal.component";
import {
  injectDestroyService,
  provideDestroyService,
} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: "comping-user-edit",
  templateUrl: "edit-user.component.html",
  providers: [provideDestroyService()], // Using an unsubscribe service to manage subscriptions
})
export class EditUserComponent implements OnInit {
  // Define component properties
  userForm!: FormGroup;
  submitted = false;
  editMode = false;
  user$: Observable<UserPayload | undefined>;
  isAdmin$: Observable<boolean | undefined>;
  isManager$: Observable<boolean | undefined>;
  superAdmin = false;

  // Service for managing component destruction lifecycle
  private readonly destroy$ = injectDestroyService();

  // Component constructor with dependency injection
  constructor(
    public errorUtil: ErrorUtil,
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    // Extract user ID from the route snapshot
    let userId = this.route.snapshot.paramMap.get("id") as string;

    // Initialize observables and dispatch action to get user roles
    this.user$ = this.store.select(getUserById(userId));
    this.isAdmin$ = this.store.select(isAdmin);
    this.isManager$ = this.store.select(isManager);
    this.store.dispatch(AuthActions.getUserViewRoles({ userId }));
  }

  ngOnInit() {
    // Initialize the user form with form controls and validators
    this.userForm = this.formBuilder.group({
      id: [""],
      username: ["", Validators.required],
      email: ["", Validators.required],
      firstName: [""],
      lastName: [""],
      selectedRole: [""],
    });

    // Subscribe to the user observable and update the form when user data changes
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) this.userForm.patchValue(user);
    });

    // Subscribe to roles observable and set the selected role in the form
    this.store
      .select(getCurrentViewRoles)
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((roles) => {
        if (roles) {
          this.superAdmin = roles.some(
            (role) => role.name === env.keycloak.superAdminRole
          );
          this.userForm.patchValue({
            selectedRole: roles.find(
              (role) =>
                role.name === env.keycloak.adminRole ||
                role.name === env.keycloak.superAdminRole
            )
              ? "manage-users"
              : roles?.find((role) => role.name === env.keycloak.managerRole)
              ? "view-users"
              : "",
          });
        }
      });

    // Set initial state of editMode
    this.changeViewEditMode();
  }

  // Toggle editMode state
  onEditMode() {
    this.editMode = !this.editMode;
    this.changeViewEditMode();
  }

  // Cancel the edit mode and reset the form to the original user data
  onCancel() {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) this.userForm.patchValue(user);
    });
    this.onEditMode();
  }

  // Open a confirmation dialog and delete the user if confirmed
  deleteUser() {
    const dialogRef = this.dialog.open(ModalComponentDialog, {
      data: this.userForm.value.username,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result)
          this.store.dispatch(
            UserActions.deleteUser({ id: this.userForm.value.id })
          );
      });
  }

  // Enable or disable form controls based on the editMode state
  private changeViewEditMode() {
    Object.keys(this.userForm.controls).forEach((field) => {
      if (this.editMode) {
        this.userForm.get(field)?.enable();
      } else {
        this.userForm.get(field)?.disable();
      }
    });
  }

  // Handle form submission
  onSubmit() {
    this.submitted = true;

    // Check if the form is valid before dispatching the update action
    if (!this.userForm.valid) return;

    // Dispatch action to update the user with the form data
    this.store.dispatch(
      UserActions.updateUser({
        user: {
          id: this.userForm.value.id,
          username: this.userForm.value.username,
          email: this.userForm.value.email,
          enabled: true,
          roleName: this.userForm.value.selectedRole,
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
        },
      })
    );

    // Scroll to the top of the page and exit edit mode
    document
      .querySelector(".nav-container")!
      .scrollIntoView({ block: "start", behavior: "smooth" });
    this.onEditMode();
  }
}
