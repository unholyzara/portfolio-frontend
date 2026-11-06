import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SettingsService } from '../../core/services/settings.service';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.html',
    styleUrl: './maintenance.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Maintenance {
    private readonly doc = inject(DOCUMENT);

    protected readonly settings = inject(SettingsService);

    protected retry(): void {
        this.doc.location.reload();
    }
}