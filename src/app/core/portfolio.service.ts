import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';

import {
  Education,
  Overview,
  PersonalInfo,
  Project,
  ProjectRepository,
  SpokenLanguage,
  Technology,
  WorkExperience,
  WorkResponsibility
} from './models';
import { Lang, SettingsService } from './settings.service';

const API = '/api';

const ENDPOINTS = {
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

const EMPTY_PERSONAL: PersonalInfo = { name: '', surname: '', job_role: '', email: '', phone_number: "" };
const EMPTY_OVERVIEW: Overview = { text: '' };

const unwrap = <T>(body: unknown): T[] =>
  Array.isArray(body) ? (body as T[]) : ((body as { results?: T[] }).results ?? []);

const listResource = <T>(url: string, lang: Signal<Lang>) =>
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

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly settings = inject(SettingsService);

  private readonly personalResource = httpResource<PersonalInfo>(
    () => ({
      url: ENDPOINTS.personal,
      headers: {
        'Accept-Language': this.settings.lang(),
      },
    }),
    { defaultValue: EMPTY_PERSONAL },
  );

  private readonly overviewResource = listResource<Overview>(
    ENDPOINTS.overview, this.settings.lang
  );
  private readonly languagesResource = listResource<SpokenLanguage>(
    ENDPOINTS.languages, this.settings.lang
  );
  private readonly educationsResource = listResource<Education>(
    ENDPOINTS.educations, this.settings.lang
  );
  private readonly technologiesResource = listResource<Technology>(
    ENDPOINTS.technologies, this.settings.lang
  );
  private readonly experiencesResource = listResource<WorkExperience>(
    ENDPOINTS.experiences, this.settings.lang
  );
  private readonly responsibilityResource = listResource<WorkResponsibility>(
    ENDPOINTS.responsibilities, this.settings.lang
  );
  private readonly projectsResource = listResource<Project>(
    ENDPOINTS.projects, this.settings.lang
  );
  private readonly repositoriesResource = listResource<ProjectRepository>(
    ENDPOINTS.repositories, this.settings.lang
  );

  readonly personal = this.personalResource.value.asReadonly();
  readonly overview = computed(() => this.overviewResource.value()[0] ?? EMPTY_OVERVIEW);
  readonly languages = this.languagesResource.value.asReadonly();
  readonly educations = this.educationsResource.value.asReadonly();
  readonly technologies = this.technologiesResource.value.asReadonly();
  readonly experiences = this.experiencesResource.value.asReadonly();
  readonly responsibilities = this.responsibilityResource.value.asReadonly();
  readonly projects = this.projectsResource.value.asReadonly();
  readonly repositories = this.repositoriesResource.value.asReadonly();

  readonly loaded = computed(() =>
    [this.projectsResource, this.experiencesResource].every(
      (resource) => resource.status() === 'resolved' || resource.status() === 'error',
    ),
  );

  project(uuid: string): Project | undefined {
    return this.projects().find((item) => item.uuid === uuid);
  }

  projectRepositories(uuid: string): ProjectRepository[] {
    return this.repositories().filter((item) => item.project === uuid)
  }

  experience(uuid: string): WorkExperience | undefined {
    return this.experiences().find((item) => item.uuid === uuid);
  }

  experienceResponsibilities(uuid: string): WorkResponsibility[] {
    return this.responsibilities().filter((item) => item.work_experience.uuid === uuid);
  }

  projectsOf(experienceId: string): Project[] {
    return this.projects().filter((item) => item.work_experience?.uuid === experienceId);
  }

  neighbours<T extends { uuid: string }>(items: readonly T[], uuid: string): { prev?: T; next?: T } {
    const index = items.findIndex((item) => item.uuid === uuid);
    return {
      prev: index > 0 ? items[index - 1] : undefined,
      next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
    };
  }
}