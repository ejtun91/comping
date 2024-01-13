import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState, APP_STATE_NAME } from "./app.reducer";

// SELECTORS FOR APP STATE DATA
const getAppState = createFeatureSelector<AppState>(APP_STATE_NAME);

export const getShowLoadingSpinner = createSelector(getAppState, (state) => {
  return state.showLoadingSpinner;
});

export const getErrorMessage = createSelector(getAppState, (state) => {
  return state.errorMessage;
});
