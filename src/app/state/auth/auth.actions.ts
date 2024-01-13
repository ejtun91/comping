import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthResponse, Roles } from "../../models/auth-response.model";
import { CurrentUser } from "../../models/current-user.model";
import { KeycloakProfile } from "keycloak-js";

// Auth Actions for dispatch
export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    "log out": emptyProps(),
    "login start": props<{ username: string; password: string }>(),
    "login start success": props<{ response: AuthResponse }>(),
    "refresh token start": emptyProps(),
    "refresh token success": props<{ response: AuthResponse }>(),
    "login start failed": props<{ response: AuthResponse }>(),
    "update current user": props<{ currentUser: CurrentUser }>(),
    "update keycloak user info": props<{ keycloakUser: KeycloakProfile }>(),
    "get user roles": props<{ userId: string }>(),
    "get user roles success": props<{ roles: Roles[] }>(),
    "get user view roles": props<{ userId: string }>(),
    "get user view roles success": props<{ roles: Roles[] }>(),
  },
});
