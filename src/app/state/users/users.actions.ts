import { Update } from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserPayload } from "../../models/user.model";

// User Actions for dispatch

export const UserActions = createActionGroup({
  source: "Users",
  events: {
    "load users": emptyProps(),
    "load users success": props<{ users: UserPayload[] }>(),
    "add user": props<{ user: UserPayload }>(),
    "add user success": props<{ user: UserPayload }>(),
    "update user": props<{ user: UserPayload }>(),
    "update user success": props<{ user: Update<UserPayload> }>(),
    "delete user": props<{ id: any }>(),
    "delete user success": props<{ id: any }>(),
    "download pdf": emptyProps(),
    "download pdf success": emptyProps(),
  },
});
