import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * Displays messages in "Toast" style
 */
@Injectable({
  providedIn: 'root',
})
export class Toast {
  constructor(
    private snackBar: MatSnackBar,
  ){}

  /**
   * Displays an error message on screen as a "toast" popping up near the bottom of the screen. Longer messages
   * will display for a longer time.
   */
  public showError(message: string) {
    this.snackBar.open(
      message,
      undefined,
      {
        // formula for duration from https://ux.stackexchange.com/a/85898/7211
        duration: Math.min(Math.max(message.length * 50, 2_000), 7_000),
        panelClass: 'snack-bar',
      }
    );
  }
}
