import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Role } from './model/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = `${environment.backendUrl}/api/auth`;

  private userSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.API}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  setSession(data: {token:string, user:User}) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.userSubject.next(data.user);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getUserId(): string | null {
    return this.getUser()?._id ?? null;
  }

  getRole(): Role | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isManager(): boolean {
    return this.getRole() === Role.MANAGER;
  }

  isTeamLead(): boolean {
    return this.getRole() === Role.TEAM_LEAD;
  }

  isEmployee(): boolean {
    return this.getRole() === Role.EMPLOYEE;
  }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }
}
