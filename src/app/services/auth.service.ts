import { Location } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment as env } from "../../environments/environment";
import { AUTH_STATE_KEY } from "../state/auth/auth.state";
import { AuthResponse, Roles } from "../models/auth-response.model";

@Injectable()
export class AuthService {
  baseUrl = env.baseUrl;
  constructor(public location: Location, private http: HttpClient) {}

  // handle login service if no KEYCLOAK MODULE AVAILABLE --LEGACY
  public login(user: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded;"
    );

    const body = new HttpParams()
      .set("grant_type", "password")
      .set("username", user)
      .set("password", password)
      .set("client_id", env.keycloak.clientId);

    return this.http.post(env.getTokenAPI, body, { headers: headers });
  }

  // handle refresh token service if no KEYCLOAK MODULE AVAILABLE --LEGACY
  public refreshToken(): Observable<any> {
    const headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded;"
    );
    const userData = JSON.parse(localStorage?.getItem(AUTH_STATE_KEY)!);

    const body = new HttpParams()
      .set("grant_type", "refresh_token")
      .set("client_id", env.keycloak.clientId)
      .set("refresh_token", userData.refresh_token);
    return this.http.post(env.getTokenAPI, body, { headers: headers });
  }

  public logout() {
    localStorage.clear();
    location.reload();
  }

  getToken(): AuthResponse | null {
    const userData = JSON.parse(localStorage?.getItem(AUTH_STATE_KEY)!);
    return userData ? userData.access_token : null;
  }

  getUserRoles(userId: string): Observable<Roles[]> {
    return this.http.get<Roles[]>(
      `${this.baseUrl}/users/${userId}/role-mappings/clients/${env.keycloak.clientForRoleID}`
    );
  }
}
