import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../model/task.model';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Input() availableUsers: User[] = [];  // Manager/TL pass their assignable users
  @Input() currentUser?: User;

  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  get canAssign(): boolean {
    return this.availableUsers.length > 0;
  }

  ngOnInit() {
    this.isEdit = !!this.task;
    const defaultAssignee = this.task?.assignedTo?._id ?? this.currentUser?._id ?? '';

    this.form = this.fb.group({
      title: [this.task?.title ?? '', Validators.required],
      description: [this.task?.description ?? ''],
      completed: [this.task?.status == 'completed'? true:false],
      assignedTo: [defaultAssignee, this.canAssign ? Validators.required : []]
    });
  }

  save() {
    if (this.form.invalid) return;
    let data = this.form.value
        data.status = data.completed?'completed':'pending';
    
    this.activeModal.close(this.form.value);
  }
}
