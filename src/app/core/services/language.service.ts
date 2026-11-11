import { Injectable } from '@angular/core';

import {
  SpokenLanguage
} from '../models';

import { AbstractApiService } from './abstract/abstract-api.service';
import { ENDPOINTS, listResource } from './utils';

@Injectable({ providedIn: 'root' })
export class LanguageService extends AbstractApiService {
  private readonly languagesResource = listResource<SpokenLanguage>(
    ENDPOINTS.languages
  );

  readonly languages = this.languagesResource.value.asReadonly();

  protected reloadData(): void {
    this.languagesResource.reload();
  }
}