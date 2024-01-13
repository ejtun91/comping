import { createAction, props } from "@ngrx/store";

// HANDLE APP CORE ACTIONS
export const showLoadingSpinner = createAction("[App] Show Loading Spinner");

export const hideLoadingSpinner = createAction("[App] Hide Loading Spinner");

export const setErrorMessage = createAction(
  "[App] set error message",
  props<{ message: string }>()
);
