import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomNodeComponent, HandleComponent } from 'ngx-vflow';

import { CardData } from '../../../../core/diagram.models';
import { CARD_HEIGHT, CARD_WIDTH } from '../../../diagram-layout';

@Component({
    selector: 'app-diagram-card',
    imports: [HandleComponent],
    templateUrl: './diagram-card.html',
    styleUrl: './diagram-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.width.px]': 'cardWidth',
        '[style.height.px]': 'cardHeight',
        '[attr.data-kind]': 'data()?.kind',
        '[class.optional]': 'data()?.optional',
    },
})
export class DiagramCard extends CustomNodeComponent<CardData> {
    readonly cardWidth = CARD_WIDTH;
    readonly cardHeight = CARD_HEIGHT;
    readonly sides = ['left', 'right', 'top', 'bottom'] as const;
}