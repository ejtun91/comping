import { createReducer, on } from "@ngrx/store";
import {
  showLoadingSpinner,
  hideLoadingSpinner,
  setErrorMessage,
} from "./app.actions";

//DEFINE APP STATE, INIT AND REDUCER FOR HANDLING OF DATA THROUGH STORE
export const APP_STATE_NAME = "app";

export interface AppState {
  showLoadingSpinner: boolean;
  errorMessage: string;
}

export const initialState: AppState = {
  showLoadingSpinner: false,
  errorMessage: "",
};

export const appReducer = createReducer(
  initialState,
  on(showLoadingSpinner, (state, action) => {
    return {
      ...state,
      showLoadingSpinner: true,
    };
  }),
  on(hideLoadingSpinner, (state, action) => {
    return {
      ...state,
      showLoadingSpinner: false,
    };
  }),
  on(setErrorMessage, (state, { message }) => ({
    ...state,
    errorMessage: message,
  }))
);
