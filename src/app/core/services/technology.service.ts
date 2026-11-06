import { Injectable } from '@angular/core';

import {
  Technology
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';

@Injectable({ providedIn: 'root' })
export class TechnologyService extends AbstractApiService {
  private readonly technologiesResource = listResource<Technology>(
    ENDPOINTS.technologies, this.settings.lang
  );

  readonly technologies = this.technologiesResource.value.asReadonly();

  protected reloadData(): void {
    this.technologiesResource.reload();
  }
}