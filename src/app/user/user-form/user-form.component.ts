import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User, Role } from '../../model/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Input() teamLeads: User[] = [];

  form!: FormGroup;
  isEdit = false;
  Role = Role;
  roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.isEdit = !!this.user;

    this.form = this.fb.group({
      username: [this.user?.username ?? '', [Validators.required, Validators.minLength(3)]],
      email: [this.user?.email ?? '', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      role: [this.user?.role ?? Role.EMPLOYEE, Validators.required],
      teamLead: [this.user?.teamLead?._id ? String(this.user.teamLead._id) : '']
    });

    this.form.get('role')!.valueChanges.subscribe(role => {
      const teamLeadCtrl = this.form.get('teamLead')!;
      if (role !== Role.EMPLOYEE) {
        teamLeadCtrl.setValue('');
      }
    });
  }

  get isEmployee(): boolean {
    return this.form.get('role')?.value === Role.EMPLOYEE;
  }

  save() {
    if (this.form.invalid) return;
    const value = { ...this.form.value };
    if (this.isEdit && !value.password) delete value.password;
    if (!this.isEmployee) delete value.teamLead;
    this.activeModal.close(value);
  }
}
