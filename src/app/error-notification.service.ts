import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
  private errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  showError(message: string): void {
    this.errorSubject.next(message);
  }
}
