import { httpResource } from '@angular/common/http';
import { Signal } from '@angular/core';

import { Lang } from './settings.service';

const API = '/api';

export const ENDPOINTS = {
    personal: `${API}/persona/personal-info/`,
    overview: `${API}/persona/overview/`,
    languages: `${API}/persona/spoken-language/`,
    educations: `${API}/persona/education/`,
    technologies: `${API}/work/technology/`,
    experiences: `${API}/work/work-experience/`,
    responsibilities: `${API}/work/work-responsibility/`,
    projects: `${API}/work/project/`,
    repositories: `${API}/work/project-repository/`,
} as const;

const unwrap = <T>(body: unknown): T[] =>
    Array.isArray(body) ? (body as T[]) : ((body as { results?: T[] }).results ?? []);

export const listResource = <T>(url: string, lang: Signal<Lang>) =>
    httpResource<T[]>(
        () => ({
            url,
            headers: {
                'Accept-Language': lang(),
            },
        }),
        {
            parse: body => unwrap<T>(body),
            defaultValue: [],
        },
    );