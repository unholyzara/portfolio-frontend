import { Injectable } from '@angular/core';

import {
  Education
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';

@Injectable({ providedIn: 'root' })
export class EducationService extends AbstractApiService {
  private readonly educationsResource = listResource<Education>(
    ENDPOINTS.educations, this.settings.lang
  );

  readonly educations = this.educationsResource.value.asReadonly();


  protected reloadData(): void {
    this.educationsResource.reload();
  }
}