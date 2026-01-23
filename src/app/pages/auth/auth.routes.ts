import { Routes } from '@angular/router';
import { UnauthorizedAccess } from './unauthorized-access';
import { Login } from './login';
import { Error } from './error';
import { Logout } from './logout';

export default [
    { path: 'unauthorized-access', component: UnauthorizedAccess },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'logout', component: Logout }
] as Routes;
