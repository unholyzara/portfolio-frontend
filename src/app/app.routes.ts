import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'unholyzara.dev',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'progetti/:uuid',
        title: 'Project',
        loadComponent: () =>
            import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
    },
    {
        path: 'esperienza/:uuid',
        title: 'Experience',
        loadComponent: () =>
            import('./pages/experience-detail/experience-detail').then((m) => m.ExperienceDetail),
    },
    {
        path: 'cv',
        title: 'cv',
        loadComponent: () => import('./pages/cv/cv-page').then((m) => m.CvPage),
    },
    { path: '**', redirectTo: '' },
];
