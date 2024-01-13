import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../state/auth/auth.actions";
import { ErrorUtil } from "../../../shared/utils/error.util";

@Component({
  selector: "comping-login",
  templateUrl: "login.component.html",
})
// class for handling login if no KEYCLOAK MODULE -- LEGACY
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: boolean = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    public errorUtil: ErrorUtil
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  login() {
    this.submitted = true;
    if (!this.form.valid) return;
    this.store.dispatch(
      AuthActions.loginStart({
        username: this.form.value.username,
        password: this.form.value.password,
      })
    );
  }
}
