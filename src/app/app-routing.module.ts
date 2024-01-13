import { NgModule, inject } from "@angular/core";
import { CanActivateFn, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./public/containers/login.component";
import { AuthGuard } from "./public/guards/keycloak.guard";

const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
};

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "",
    canActivate: [isAuthenticated],
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
