import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { UserActions } from "../../../state/users/users.actions";
import { ErrorUtil } from "../../../../shared/utils/error.util";
import { Observable } from "rxjs";
import { isAdmin, isManager } from "../../../state/auth/auth.selectors";

@Component({
  selector: "comping-new-user",
  templateUrl: "new-user.component.html",
})
export class NewUserComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  isAdmin$: Observable<boolean | undefined>;
  isManager$: Observable<boolean | undefined>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    public errorUtil: ErrorUtil
  ) {
    // Initialize observables for admin and manager status
    this.isAdmin$ = this.store.select(isAdmin);
    this.isManager$ = this.store.select(isManager);
  }

  ngOnInit() {
    // Initialize the user form with form controls and validators
    this.userForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      firstName: [""],
      lastName: [""],
      selectedRole: [""],
    });
  }

  // Handle form submission
  onSubmit() {
    this.submitted = true;

    // Check if the form is valid before dispatching the add user action
    if (!this.userForm.valid) return;

    // Dispatch action to add a new user with the form data
    this.store.dispatch(
      UserActions.addUser({
        user: {
          username: this.userForm.value.username,
          email: this.userForm.value.email,
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          enabled: true,
          roleName: this.userForm.value.selectedRole,
          credentials: [
            { type: "password", value: this.userForm.value.password },
          ],
        },
      })
    );
  }
}
