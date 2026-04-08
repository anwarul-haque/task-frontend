import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, Role } from '../model/user.model';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  users: User[] = [];
  teamLeads: User[] = [];
  loading = false;
  userToDelete: User | null = null;
  currentUser!: User;
  Role = Role;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.teamLeads = users.filter(u => u.role === Role.TEAM_LEAD);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  openForm(user?: User) {
    const modalRef = this.modalService.open(UserFormComponent, { centered: true, size: 'md' });
    if (user) modalRef.componentInstance.user = { ...user };
    modalRef.componentInstance.teamLeads = this.teamLeads;

    modalRef.result
      .then((formValue) => {
        if (user?._id) {
          this.userService.updateUser(user._id, formValue).subscribe(() => this.loadUsers());
        } else {
          this.userService.createUser(formValue).subscribe(() => this.loadUsers());
        }
      })
      .catch(() => {});
  }

  confirmDelete(user: User) {
    this.userToDelete = user;
    this.modalService
      .open(this.deleteModal, { centered: true, size: 'sm' })
      .result.then(() => {
        this.userService.deleteUser(this.userToDelete!._id!).subscribe(() => {
          this.users = this.users.filter(u => u._id !== this.userToDelete!._id);
          this.userToDelete = null;
        });
      })
      .catch(() => (this.userToDelete = null));
  }

  assignToTeamLead(user: User, teamLeadId: string) {
    if (!teamLeadId) return;
    this.userService.assignToTeamLead(user._id!, teamLeadId).subscribe(() => this.loadUsers());
  }

  roleBadgeClass(role: Role): string {
    switch (role) {
      case Role.MANAGER:  return 'bg-danger';
      case Role.TEAM_LEAD: return 'bg-warning text-dark';
      default:            return 'bg-secondary';
    }
  }
}
