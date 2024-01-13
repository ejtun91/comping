import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState, initialAuthState } from "./auth.state";
import { environment } from "../../../environments/environment";

// SELECTOR FUNCTIONS FOR HANDLING DATA FROM STORE
export const AUTH_STATE_NAME = "auth";

const getAuthState = createFeatureSelector<AuthState>(AUTH_STATE_NAME);

export const getCurrentUser = createSelector(getAuthState, (currentUser) => {
  return currentUser.currentUser;
});

export const isAdmin = createSelector(getAuthState, (currentUser) => {
  return (
    currentUser.currentUser?.roles?.some(
      (role) =>
        role.name == environment.keycloak.adminRole ||
        role.name == environment.keycloak.superAdminRole
    ) || false
  );
});

export const isManager = createSelector(getAuthState, (currentUser) => {
  return currentUser.currentUser?.roles?.some(
    (role) => role.name == environment.keycloak.managerRole
  );
});

export const getCurrentViewRoles = createSelector(
  getAuthState,
  (currentUser) => {
    return currentUser.currentUser?.viewRoles;
  }
);

export function getAuthInitialState() {
  return initialAuthState;
}
