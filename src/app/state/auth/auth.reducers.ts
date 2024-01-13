import { createReducer, on } from "@ngrx/store";
import { AUTH_STATE_KEY } from "./auth.state";
import { AuthActions } from "./auth.actions";
import { getAuthInitialState } from "./auth.selectors";

export const authReducer = createReducer(
  getAuthInitialState(),
  // handle store update if no KEYCLOAK MODULE -- LEGACY
  on(AuthActions.loginStartSuccess, (state, { response }) => {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(response));
    return {
      ...state,
      loaded: true,
    };
  }),
  // handle reducer logout if no KEYCLOAK MODULE -- LEGACY
  on(AuthActions.logOut, (state) => {
    return {
      ...state,
      currentUser: null,
    };
  }),

  on(AuthActions.updateCurrentUser, (state, { currentUser }) => {
    return {
      ...state,
      currentUser,
    };
  }),
  // handle reducer update if no KEYCLOAK MODULE -- LEGACY
  on(AuthActions.refreshTokenSuccess, (state, { response }) => {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(response));
    return {
      ...state,
    };
  }),
  // UPDATE STORE BASED ON ACTION -- REST
  on(AuthActions.getUserRolesSuccess, (state, { roles }) => {
    return {
      ...state,
      currentUser: { ...state.currentUser!, roles },
    };
  }),
  on(AuthActions.getUserViewRolesSuccess, (state, { roles }) => {
    return {
      ...state,
      currentUser: { ...state.currentUser!, viewRoles: roles },
    };
  }),
  on(AuthActions.updateKeycloakUserInfo, (state, { keycloakUser }) => {
    return {
      ...state,
      currentUser: { ...state.currentUser!, ...keycloakUser },
    };
  })
);
