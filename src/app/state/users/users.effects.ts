import { Injectable, inject } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { catchError, of, exhaustMap, map, mergeMap, delay } from "rxjs";

import { Store } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { Router } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { UserActions } from "./users.actions";
import { User, UserPayload } from "../../models/user.model";
import { hideLoadingSpinner, showLoadingSpinner } from "../app.actions";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UsersEffects {
  // Injected dependencies
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);

  // Effect for loading users
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      exhaustMap(() => {
        this.store.dispatch(showLoadingSpinner());
        return this.usersService.getUsers().pipe(
          map((users: UserPayload[]) => {
            this.store.dispatch(hideLoadingSpinner());
            return UserActions.loadUsersSuccess({ users });
          }),
          catchError((err) => {
            if (err) this.store.dispatch(hideLoadingSpinner());
            return of(err);
          })
        );
      })
    )
  );

  // Effect for updating a user
  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) => {
        this.store.dispatch(showLoadingSpinner());
        return this.usersService.updateUser(user).pipe(
          map((resUser: any) => {
            const updatedUser: Update<UserPayload> = {
              id: user?.id!,
              changes: {
                ...user,
              },
            };
            this.store.dispatch(hideLoadingSpinner());
            this._snackBar.open("Update Success", "Close", {
              duration: 5000,
              verticalPosition: "bottom",
              horizontalPosition: "center",
            });
            return UserActions.updateUserSuccess({
              user: updatedUser,
            });
          }),
          catchError((err) => {
            if (err) {
              this.store.dispatch(hideLoadingSpinner());
              this._snackBar.open(
                err.error.error_description || "Update Failed",
                "Close",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                }
              );
            }
            return of(err);
          })
        );
      })
    );
  });

  // Effect for deleting a user
  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) => {
        this.store.dispatch(showLoadingSpinner());
        return this.usersService.deleteUser(action.id).pipe(
          map((id) => {
            this.store.dispatch(hideLoadingSpinner());
            this._snackBar.open("Delete Success", "Close", {
              duration: 5000,
              verticalPosition: "bottom",
              horizontalPosition: "center",
            });
            this.router.navigate(["/admin"]);
            return UserActions.deleteUserSuccess({ id: action.id });
          }),
          catchError((err) => {
            if (err) {
              this.store.dispatch(hideLoadingSpinner());
              this._snackBar.open(
                err.error.error_description || "Delete Failed",
                "Close",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                }
              );
            }
            return of(err);
          })
        );
      })
    );
  });

  // Effect for adding a new user
  addUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.addUser),
      exhaustMap(({ user }) => {
        this.store.dispatch(showLoadingSpinner());
        return this.usersService.createUser(user).pipe(
          map((res: any) => {
            const userId: string =
              this.usersService.newUserID$.getValue() as string;
            this.store.dispatch(hideLoadingSpinner());
            this.router.navigate(["/admin"]);
            this._snackBar.open("Create Success", "Close", {
              duration: 5000,
              verticalPosition: "bottom",
              horizontalPosition: "center",
            });
            return UserActions.addUserSuccess({
              user: { ...user, id: userId },
            });
          }),
          catchError((err) => {
            if (err) {
              this.store.dispatch(hideLoadingSpinner());
              this._snackBar.open(
                err.error.error_description || "Create User Failed",
                "Close",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                }
              );
            }
            return of(err);
          })
        );
      })
    );
  });

  // Effect for downloading a PDF file
  downloadPDF$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.downloadPdf),
      mergeMap(() => {
        this.store.dispatch(showLoadingSpinner());
        return this.usersService.getPdf().pipe(
          map((blob: Blob) => {
            // Handle the downloaded PDF file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "sample.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.store.dispatch(hideLoadingSpinner());
            this._snackBar.open("Download Success", "Close", {
              duration: 5000,
              verticalPosition: "bottom",
              horizontalPosition: "center",
            });
            this.router.navigate(["/admin"]);
            return UserActions.downloadPdfSuccess();
          }),
          catchError((err) => {
            if (err) {
              this.store.dispatch(hideLoadingSpinner());
              this._snackBar.open(
                err.error.error_description || "Cors Free Service Down",
                "Close",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                }
              );
            }
            return of(err);
          })
        );
      })
    );
  });
}
