import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  catchError,
  concat,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { UserPayload } from "../models/user.model";
import { environment as env } from "../../environments/environment";

@Injectable()
export class UsersService {
  baseUrl = env.baseUrl;
  // BehaviorSubject to track the newly created user ID
  newUserID$ = new BehaviorSubject<string | null>(null);
  constructor(private http: HttpClient) {}

  // Fetches the list of users from the server
  getUsers(): Observable<UserPayload[]> {
    return this.http.get<UserPayload[]>(`${this.baseUrl}/users`);
  }

  // Creates a new user, optionally assigns a role, and updates the new user ID
  createUser(user: UserPayload): Observable<any> {
    const { roleName, ...rest } = user;
    // If no role is provided, create a user without assigning a role
    if (!roleName) {
      return this.http
        .post<UserPayload>(`${this.baseUrl}/users`, rest, {
          observe: "response",
        })
        .pipe(
          map((createdUser: any) => {
            const createdUserLocation = createdUser.headers.get("Location");

            // Extract and update the newly created user ID
            if (createdUserLocation) {
              const createdUserId = createdUserLocation.split("/").pop();
              this.newUserID$.next(createdUserId);
              return;
            } else {
              return of("Error: User ID not available.");
            }
          })
        );
    }

    // Create user and assign role
    return this.http
      .post<UserPayload>(`${this.baseUrl}/users`, rest, { observe: "response" })
      .pipe(
        switchMap((createdUser: any) => {
          const createdUserLocation = createdUser.headers.get("Location");
          if (createdUserLocation) {
            const createdUserId = createdUserLocation.split("/").pop();
            this.newUserID$.next(createdUserId);

            // Assign the specified role to the created user
            const assignRoleRequest = this.assignRealmRole(
              createdUserId,
              roleName
            );
            return assignRoleRequest.pipe(
              map(() => "Success"),
              catchError((error) => of(`Error assigning role: ${error}`))
            );
          } else {
            return of("Error: User ID not available.");
          }
        })
      );
  }

  // Assigns a  role to a user
  private assignRealmRole(userId: string, roleName: string): Observable<any> {
    const requestBody = [
      {
        id:
          roleName == env.keycloak.adminRole
            ? env.keycloak.adminRoleID
            : env.keycloak.managerRoleID,
        name: roleName,
      },
    ];

    return this.http
      .post(
        `${this.baseUrl}/users/${userId}/role-mappings/clients/${env.keycloak.clientForRoleID}`,
        requestBody
      )
      .pipe(
        tap((response) => {
          console.log("Role assigned successfully:", response);
        }),
        catchError((error) => {
          console.error("Error assigning role:", error);
          throw error;
        })
      );
  }

  // Deletes a user by ID
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  // Updates a user, optionally assigns a role
  updateUser(updatedUser: UserPayload): Observable<void> {
    const { roleName, ...rest } = updatedUser;
    if (!roleName)
      return this.http.put<void>(
        `${this.baseUrl}/users/${updatedUser.id}`,
        rest
      );

    if (roleName === "regular") {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      };
      const deleteRequest = this.http.delete<void>(
        `${this.baseUrl}/users/${updatedUser.id}/role-mappings/clients/${env.keycloak.clientForRoleID}`,
        httpOptions
      );

      const updateRequest = this.http.put<void>(
        `${this.baseUrl}/users/${updatedUser.id}`,
        rest
      );

      // Combine the delete and update requests
      return concat(deleteRequest, updateRequest).pipe(
        catchError((error) => {
          console.error("Error during delete or update:", error);
          throw error;
        })
      );
    }

    return this.http
      .put<void>(`${this.baseUrl}/users/${updatedUser.id}`, rest)
      .pipe(
        switchMap(() =>
          this.assignRealmRole(updatedUser?.id!, roleName as string)
        )
      );
  }

  // Fetches a PDF file from the server using CORS proxy (run "npm run start" to make it work)
  getPdf(): Observable<Blob> {
    const headers = new HttpHeaders({
      "Content-Type": "application/pdf",
      Accept: "application/pdf",
    });
    return this.http.get(`${env.cors}/${env.pdfUrl}`, {
      headers,
      responseType: "blob",
    });
  }
}
