import { computed, Injectable } from '@angular/core';

import {
  Project,
  ProjectRepository
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';


@Injectable({ providedIn: 'root' })
export class ProjectService extends AbstractApiService {
  private readonly projectsResource = listResource<Project>(
    ENDPOINTS.projects, this.settings.lang
  );
  private readonly repositoriesResource = listResource<ProjectRepository>(
    ENDPOINTS.repositories, this.settings.lang
  );

  readonly projects = this.projectsResource.value.asReadonly();
  readonly repositories = this.repositoriesResource.value.asReadonly();

  readonly loaded = computed(() =>
    [this.projectsResource].every(
      (resource) => resource.status() === 'resolved' || resource.status() === 'error',
    ),
  );

  protected reloadData(): void {
    this.projectsResource.reload();
    this.repositoriesResource.reload();
  }

  project(uuid: string): Project | undefined {
    return this.projects().find((item) => item.uuid === uuid);
  }

  projectRepositories(uuid: string): ProjectRepository[] {
    return this.repositories().filter((item) => item.project === uuid)
  }

  projectsOf(experienceId: string): Project[] {
    return this.projects().filter((item) => item.work_experience?.uuid === experienceId);
  }
}