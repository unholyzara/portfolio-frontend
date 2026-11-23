import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SettingsService } from '../../core/services/settings.service';
import { I18nService } from '../../i18n';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.html',
    styleUrl: './maintenance.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Maintenance {
    private readonly doc = inject(DOCUMENT);

    protected readonly settings = inject(SettingsService);
    protected readonly t = inject(I18nService).t;

    protected retry(): void {
        this.doc.location.reload();
    }
}