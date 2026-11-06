import { effect, inject, Injectable, untracked } from '@angular/core';
import { SettingsService } from '../settings.service';

@Injectable()
export abstract class AbstractApiService {
    protected readonly settings = inject(SettingsService);

    private wasInMaintenance = false;

    constructor() {
        effect(() => {
            const maintenance = this.settings.status().maintenance;

            if (this.wasInMaintenance !== maintenance) {
                untracked(() => this.reloadData());
            }

            this.wasInMaintenance = maintenance;
        });
    }

    protected abstract reloadData(): void;
}