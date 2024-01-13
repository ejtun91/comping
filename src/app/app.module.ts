import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { AuthService } from "./services/auth.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./public/containers/login.component";

import { UsersService } from "./services/users.service";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AuthEffects } from "./state/auth/auth.effects";
import { appReducer } from "./state/app.reducer";
import { authReducer } from "./state/auth/auth.reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment as env } from "../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { LoadingSpinnerComponent } from "../shared/components/spinner/loading-spinner.component";
import { SharedModule } from "../shared/shared.module";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { HttpErrorInterceptor } from "./core/interceptors/http-error.interceptor";

// Function to initialize Keycloak during app startup
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: env.keycloak.base,
        realm: env.keycloak.realm,
        clientId: env.keycloak.clientId,
      },
      initOptions: {
        onLoad: "check-sso",
      },
    });
}

@NgModule({
  declarations: [AppComponent, LoginComponent, LoadingSpinnerComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    ReactiveFormsModule,

    // NgRx modules
    StoreModule.forRoot({
      app: appReducer,
      auth: authReducer,
    }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: env.production,
    }),
  ],
  providers: [
    KeycloakService,
    AuthService,
    UsersService,
    // HTTP Interceptor for authentication
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // HTTP Interceptor for http errors
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    // App initializer for Keycloak
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
