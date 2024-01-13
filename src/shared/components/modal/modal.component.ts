import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "modal",
  templateUrl: "modal.component.html",
})
export class ModalComponent {
  data?: string;
  constructor() {}
}

@Component({
  selector: "modal-dialog",
  templateUrl: "modal.component.html",
})
export class ModalComponentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
