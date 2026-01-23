import { Routes } from '@angular/router';
import { UnauthorizedAccess } from './unauthorized-access/unauthorized-access';
import { Login } from './login/login';
import { Error } from './error/error';
import { Logout } from './logout/logout';

export default [
    { path: 'unauthorized-access', component: UnauthorizedAccess },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'logout', component: Logout }
] as Routes;
