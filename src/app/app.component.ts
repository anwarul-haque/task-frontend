import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './model/user.model';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  user!: User;
  errorMessage: string | null = null;
  private errorSub!: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private errorNotification: ErrorNotificationService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.errorSub = this.errorNotification.error$.subscribe(msg => {
      this.errorMessage = msg;
      setTimeout(() => this.errorMessage = null, 5000);
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  dismissError() {
    this.errorMessage = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
