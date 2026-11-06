import { computed, Injectable } from '@angular/core';

import {
  WorkExperience,
  WorkResponsibility
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';


@Injectable({ providedIn: 'root' })
export class ExperieceService extends AbstractApiService {
  private readonly experiencesResource = listResource<WorkExperience>(
    ENDPOINTS.experiences, this.settings.lang
  );
  private readonly responsibilityResource = listResource<WorkResponsibility>(
    ENDPOINTS.responsibilities, this.settings.lang
  );

  readonly experiences = this.experiencesResource.value.asReadonly();
  readonly responsibilities = this.responsibilityResource.value.asReadonly();

  readonly loaded = computed(() =>
    [this.experiencesResource, this.responsibilityResource].every(
      (resource) => resource.status() === 'resolved' || resource.status() === 'error',
    ),
  );

  protected reloadData(): void {
    this.experiencesResource.reload();
    this.responsibilityResource.reload();
  }

  experience(uuid: string): WorkExperience | undefined {
    return this.experiences().find((item) => item.uuid === uuid);
  }

  experienceResponsibilities(uuid: string): WorkResponsibility[] {
    return this.responsibilities().filter((item) => item.work_experience.uuid === uuid);
  }
}