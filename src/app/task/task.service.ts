import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private API = `${environment.backendUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<{ success: boolean; count: number; data: Task[] }>(this.API).pipe(map(res=>res.data));
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<{ success: boolean; data: Task }>(`${this.API}/${id}`).pipe(map(res => res.data));
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.API, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
