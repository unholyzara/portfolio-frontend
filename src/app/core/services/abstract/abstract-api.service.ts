import { effect, inject, Injectable, untracked } from '@angular/core';
import { SettingsService } from '../settings.service';

@Injectable()
export abstract class AbstractApiService {
    protected readonly settings = inject(SettingsService);

    private lastMaintenance = this.settings.status().maintenance;
    private lastLang = this.settings.lang();

    constructor() {
        effect(() => {
            const maintenance = this.settings.status().maintenance;
            const lang = this.settings.lang();

            if (maintenance === this.lastMaintenance && lang === this.lastLang) {
                return;
            }

            this.lastMaintenance = maintenance;
            this.lastLang = lang;
            untracked(() => this.reloadData());
        });
    }

    protected abstract reloadData(): void;
}