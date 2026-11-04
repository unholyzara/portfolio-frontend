import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'mail' | 'phone';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.html',
    styleUrl: './icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
    readonly name = input.required<IconName>();
    readonly size = input<number>(24);
    readonly strokeWidth = input<number>(2.5);
}