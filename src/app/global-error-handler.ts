import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { ErrorNotificationService } from './error-notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorService = inject(ErrorNotificationService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.zone.run(() => this.errorService.showError(message));
  }
}
