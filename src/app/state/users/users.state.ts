import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { UserPayload } from "../../models/user.model";

// DEFINE USER STATE AND INIT
export const USER_STATE_NAME = "users";

export interface UserState extends EntityState<UserPayload> {
  loaded: boolean;
}

export const userAdapter = createEntityAdapter<UserPayload>();

export const initialState: UserState = userAdapter.getInitialState({
  loaded: false,
});
