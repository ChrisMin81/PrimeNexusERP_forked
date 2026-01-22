import { Routes } from '@angular/router';
import { Empty } from '@/pages/empty/empty';
import { TestPage } from '@/pages/test-pages/test-page';

export default [
    { path: 'empty', component: Empty },
    { path: 'test', component: TestPage },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
