import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';

import {
  Overview,
  PersonalInfo
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';

const EMPTY_PERSONAL: PersonalInfo = { name: '', surname: '', location: '', job_role: '', email: '', phone_number: "" };
const EMPTY_OVERVIEW: Overview = { short_text: '', text: '' };

@Injectable({ providedIn: 'root' })
export class PersonaService extends AbstractApiService {
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
    ENDPOINTS.overview
  );

  readonly personal = this.personalResource.value.asReadonly();
  readonly overview = computed(() => this.overviewResource.value()[0] ?? EMPTY_OVERVIEW);

  protected reloadData(): void {
    this.personalResource.reload();
    this.overviewResource.reload();
  }
}