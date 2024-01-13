import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ErrorUtil {
  public showErrors(type: string, form: FormGroup, submit?: boolean) {
    let convertedInput = type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (str) {
        return str.toUpperCase();
      });
    const input = form.get(type);
    let error = null;
    if ((input?.touched && !input.valid) || submit) {
      if (input?.errors?.['required']) {
        error = `${convertedInput} is required`;
      }
      if (input?.errors?.['email']) {
        error = `${convertedInput} is not in correct format!`;
      }
    }

    return error;
  }
}
