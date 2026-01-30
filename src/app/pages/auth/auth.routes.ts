import { Routes } from '@angular/router';
import { UnauthorizedAccess } from './unauthorized-access/unauthorized-access.component';
import { Login } from './login/login.component';
import { Error } from './error/error.component';
import { Logout } from './logout/logout.component';
import { loginRedirectGuard } from './login-redirect.guard';

export default [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'unauthorized-access', component: UnauthorizedAccess },
    { path: 'error', component: Error },
    { path: 'login', component: Login, canActivate: [loginRedirectGuard] },
    { path: 'logout', component: Logout }
] as Routes;

