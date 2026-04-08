import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from './model/user.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API = `${environment.backendUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<{ success: boolean; count: number; data: User[] }>(this.API).pipe(map(res => res.data));
  }

  getTeamMembers(): Observable<User[]> {
    return this.http.get<{ success: boolean; data: User[] }>(`${this.API}/team`).pipe(map(res => res.data));
  }

  createUser(data: Partial<User>): Observable<User> {
    return this.http.post<{ success: boolean; data: User }>(this.API, data).pipe(map(res => res.data));
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<{ success: boolean; data: User }>(`${this.API}/${id}`, data).pipe(map(res => res.data));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  assignToTeamLead(userId: string, teamLeadId: string): Observable<User> {
    return this.http.patch<{ success: boolean; data: User }>(`${this.API}/${userId}/assign`, { teamLeadId: teamLeadId }).pipe(map(res => res.data));
  }
}
