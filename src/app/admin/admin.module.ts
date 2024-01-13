import { NgModule } from "@angular/core";

import { UsersListComponent } from "./containers/users/users.component";
import { NewUserComponent } from "./containers/new/new-user.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { EditUserComponent } from "./containers/edit/edit-user.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { EffectsModule } from "@ngrx/effects";
import { UsersEffects } from "../state/users/users.effects";
import { StoreModule } from "@ngrx/store";
import { USER_STATE_NAME } from "../state/users/users.state";
import { userReducer } from "../state/users/users.reducers";
import { AdminComponent } from "./admin.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    StoreModule.forFeature(USER_STATE_NAME, userReducer),
    EffectsModule.forFeature([UsersEffects]),
  ],
  declarations: [
    UsersListComponent,
    NewUserComponent,
    EditUserComponent,
    AdminComponent,
  ],
})
export class AdminModule {}
