import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { I18nService } from './i18n';

export const routes: Routes = [
    {
        path: '',
        title: 'unholyzara.dev',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'progetti/:uuid',
        title: () => inject(I18nService).t('Project'),
        loadComponent: () =>
            import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
    },
    {
        path: 'esperienza/:uuid',
        title: () => inject(I18nService).t('Experience'),
        loadComponent: () =>
            import('./pages/experience-detail/experience-detail').then((m) => m.ExperienceDetail),
    },
    {
        path: 'cv',
        title: () => inject(I18nService).t('CV'),
        loadComponent: () => import('./pages/cv/cv-page').then((m) => m.CvPage),
    },
    { path: '**', redirectTo: '' },
];
