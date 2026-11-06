import { httpResource } from '@angular/common/http';
import { computed, Injectable, Signal } from '@angular/core';

import {
  Overview,
  PersonalInfo,
  SpokenLanguage
} from '../models';
import { Lang } from './settings.service';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS } from './utils';

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
export class PersonaService extends AbstractApiService {
  private readonly personalResource = httpResource<PersonalInfo>(
    () => ({
      url: ENDPOINTS.personal,
    }),
    { defaultValue: EMPTY_PERSONAL },
  );

  private readonly overviewResource = listResource<Overview>(
    ENDPOINTS.overview, this.settings.lang
  );
  private readonly languagesResource = listResource<SpokenLanguage>(
    ENDPOINTS.languages, this.settings.lang
  );

  readonly personal = this.personalResource.value.asReadonly();
  readonly overview = computed(() => this.overviewResource.value()[0] ?? EMPTY_OVERVIEW);
  readonly languages = this.languagesResource.value.asReadonly();

  protected reloadData(): void {
    this.personalResource.reload();
    this.overviewResource.reload();
    this.languagesResource.reload();
  }

  neighbours<T extends { uuid: string }>(items: readonly T[], uuid: string): { prev?: T; next?: T } {
    const index = items.findIndex((item) => item.uuid === uuid);
    return {
      prev: index > 0 ? items[index - 1] : undefined,
      next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
    };
  }
}