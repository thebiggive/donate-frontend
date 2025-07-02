import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Displays messages in "Toast" style
 */
@Injectable({
  providedIn: 'root',
})
export class Toast {
  private snackBar = inject(MatSnackBar);

  public showSuccess(message: string) {
    this.snackBar.open(message, undefined, {
      duration: this.getDuration(message, 2_000, 7_000),
      panelClass: 'success-bar',
    });
  }

  /**
   * Displays an error message on screen as a "toast" popping up near the bottom of the screen. Longer messages
   * will display for a longer time.
   */
  public showError(message: string, { minDurationMs = 2_000, maxDurationMs = 7_000 } = {}) {
    const duration = this.getDuration(message, minDurationMs, maxDurationMs);

    this.snackBar.open(message, undefined, {
      duration: duration,
      panelClass: 'error-bar',
    });
  }

  /**
   * formula for duration from https://ux.stackexchange.com/a/85898/7211
   */
  private getDuration(message: string, minDurationMs: number, maxDurationMs: number): number {
    return Math.min(Math.max(message.length * 50, minDurationMs), maxDurationMs);
  }
}
