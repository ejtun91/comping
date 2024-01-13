import { UserPayload } from "../../models/user.model";
// DEFINE AUTHSTATE AND INIT
export const AUTH_STATE_KEY = "currentUser";

export interface AuthState {
  currentUser: UserPayload | null;
  loaded: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  loaded: true,
};
