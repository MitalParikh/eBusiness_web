import { Routes } from '@angular/router';
// Update the import path if the file is named 'home-page.component.ts' and located in a different folder, for example:
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { ProjectGridComponent } from './admin/tools/project-grid.component';
import { EbizFlowComponent } from './ebizFlow/ebizFlow.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent // Use the actual component class
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'ebizFlow',
        component: EbizFlowComponent
    },
    {
        path: 'projects',
        loadComponent: () => import('./admin/tools/project-grid.component').then(m => m.ProjectGridComponent)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full' // Ensure that unmatched routes redirect to the home page
    }
];
