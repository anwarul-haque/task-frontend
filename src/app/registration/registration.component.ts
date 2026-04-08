import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Role } from '../model/user.model';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  successMsg = '';
  errorMsg = '';
  roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        role: [Role.EMPLOYEE, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  // Custom validator
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const payload = {
      username: this.form.value.username,
      email: this.form.value.email,
      role: this.form.value.role,
      password: this.form.value.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Redirecting to login...';
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}