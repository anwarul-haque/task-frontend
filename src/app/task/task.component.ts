import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Task } from '../model/task.model';
import { User, Role } from '../model/user.model';
import { TaskService } from './task.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { SocketService } from '../socket.service';
import { TaskFormComponent } from './task-form/task-form.component';

@Component({
  selector: 'app-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit, OnDestroy {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  tasks: Task[] = [];
  users: User[] = [];
  statusFilter: string = 'all';

  loading = false;
  taskToDelete: Task | null = null;
  currentUser!: User;
  Role = Role; // expose enum to template

  private socketSubs = new Subscription();

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private socketService: SocketService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadTasks();
    this.loadAssignableUsers();
    this.listenToSocketEvents();
  }

  ngOnDestroy() {
    this.socketSubs.unsubscribe();
  }

  private listenToSocketEvents() {
    this.socketSubs.add(
      this.socketService.onTaskUpdated().subscribe(updated => {
        this.tasks = this.tasks.map(t => t._id === updated._id ? updated : t);
      })
    );
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  loadAssignableUsers() {
    
    this.userService.getUsers().subscribe(users => {
      this.users = users || [];
    });
   
  }

  get isManager(): boolean {
    return this.currentUser?.role === Role.MANAGER;
  }

  get isTeamLead(): boolean {
    return this.currentUser?.role === Role.TEAM_LEAD;
  }

  get isEmployee(): boolean {
    return this.currentUser?.role === Role.EMPLOYEE;
  }


  canDelete(task: Task): boolean {
    if (this.isManager || this.isTeamLead) return true;
    return task.createdBy === this.currentUser._id;
  }



  openForm(task?: Task) {
    const modalRef = this.modalService.open(TaskFormComponent, { centered: true, size: 'md' });
    if (task) {
      modalRef.componentInstance.task = { ...task };
    }
    modalRef.componentInstance.availableUsers = this.users;
    modalRef.componentInstance.currentUser = this.currentUser;

    modalRef.result
      .then((formValue) => {
        // Employee: always assign task to self
        if (this.isEmployee) {
          formValue.assignedTo = this.currentUser._id;
        }
        if (task?._id) {
          this.taskService.updateTask(task._id, formValue).subscribe(() => this.loadTasks());
        } else {
          this.taskService.createTask(formValue).subscribe(() => this.loadTasks());
        }
      })
      .catch(() => {});
  }

  confirmDelete(task: Task) {
    this.taskToDelete = task;
    this.modalService
      .open(this.deleteModal, { centered: true, size: 'sm' })
      .result.then(() => {
        this.taskService.deleteTask(this.taskToDelete!._id!).subscribe(() => {
          this.tasks = this.tasks.filter((t) => t._id !== this.taskToDelete!._id);
          this.taskToDelete = null;
        });
      })
      .catch(() => {
        this.taskToDelete = null;
      });
  }

  get filteredTasks(): Task[] {
    if (this.statusFilter === 'all') return this.tasks;
    return this.tasks.filter(t => t.status === this.statusFilter);
  }

  roleBadgeClass(role: string | undefined): string {
    switch (role) {
      case Role.MANAGER:  return 'bg-danger';
      case Role.TEAM_LEAD: return 'bg-warning text-dark';
      default:            return 'bg-secondary';
    }
  }
}
