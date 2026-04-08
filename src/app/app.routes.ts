import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { TaskComponent } from './task/task.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';
import { ManagerGuard } from './manager.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    {
        path: 'tasks',
        canActivate: [AuthGuard],
        component: TaskComponent
    },
    {
        path: 'users',
        canActivate: [AuthGuard, ManagerGuard],
        component: UserComponent
    },
    { path: '**', redirectTo: 'tasks' }
];
