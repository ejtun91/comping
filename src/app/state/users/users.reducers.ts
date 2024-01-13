import { createReducer, on } from "@ngrx/store";

import { UserActions } from "./users.actions";
import { initialState, userAdapter } from "./users.state";

// Reducer function for managing user-related actions
export const userReducer = createReducer(
  initialState,
  // Case for handling the success of loading users
  on(UserActions.loadUsersSuccess, (state, { users }) => {
    // Update the state with the loaded users
    return userAdapter.setAll(users, {
      ...state,
      loaded: true,
    });
  }),

  // Case for handling the success of updating a user
  on(UserActions.updateUserSuccess, (state, { user }) => {
    // Update the state with the modified user
    return userAdapter.updateOne(user, state);
  }),

  // Case for handling the success of deleting a user
  on(UserActions.deleteUserSuccess, (state, { id }) => {
    // Remove the deleted user from the state
    return userAdapter.removeOne(id, state);
  }),

  // Case for handling the success of adding a new user
  on(UserActions.addUserSuccess, (state, { user }) => {
    // Add the new user to the state
    return userAdapter.addOne(user, state);
  })
);
