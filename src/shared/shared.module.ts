import { NgModule } from "@angular/core";
import { NavComponent } from "./components/nav/nav.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import {
  ModalComponent,
  ModalComponentDialog,
} from "./components/modal/modal.component";
import { MatDialogModule } from "@angular/material/dialog";

const UX_COMPONENTS = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatSortModule,
  MatSelectModule,
  MatTableModule,
  MatDialogModule,
];

@NgModule({
  imports: [CommonModule, ...UX_COMPONENTS],
  exports: [
    NavComponent,
    ...UX_COMPONENTS,
    ModalComponent,
    ModalComponentDialog,
  ],
  declarations: [NavComponent, ModalComponent, ModalComponentDialog],
  providers: [],
})
export class SharedModule {}
