import { createFeatureSelector, createSelector } from "@ngrx/store";
import { USER_STATE_NAME, UserState, userAdapter } from "./users.state";

// USER SELECTOR FUNCTIONS FOR HANDLING DATA FROM STORE

const usersSelectors = userAdapter.getSelectors();

const getUserState = createFeatureSelector<UserState>(USER_STATE_NAME);

export const getAllUsers = createSelector(
  getUserState,
  usersSelectors.selectAll
);

const getUserEntities = createSelector(
  getUserState,
  usersSelectors.selectEntities
);

export const isUserLoaded = createSelector(getUserState, (state) => {
  return state.loaded;
});

export const getUserLength = createSelector(getAllUsers, (users) => {
  return users.length;
});

export const getUserById = (id: string) =>
  createSelector(getUserEntities, (users) => {
    return users && users[id];
  });
