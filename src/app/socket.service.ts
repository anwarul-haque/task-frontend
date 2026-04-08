import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Task } from './model/task.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.backendUrl, {
      auth: { token: localStorage.getItem('token') }
    });
  }

  onTaskUpdated(): Observable<Task> {
    return new Observable(observer => {
      this.socket.on('task:updated', ({ data }: { data: Task }) => observer.next(data));
    });
  }


  ngOnDestroy() {
    this.socket.disconnect();
  }
}
