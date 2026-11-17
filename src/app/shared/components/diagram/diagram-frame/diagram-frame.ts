import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomNodeComponent, HandleComponent } from 'ngx-vflow';

import { FrameData } from '../../../../core/diagram.models';

/**
 * Frame around the containers. It represents the host that runs them (the EC2 Spot),
 * so it has handles on every side: edges from/to the host attach here.
 */
@Component({
  selector: 'app-diagram-frame',
  imports: [HandleComponent],
  template: `
    <span class="label">{{ data()?.label }}</span>
    @for (side of sides; track side) {
      <handle type="source" [position]="side" [id]="'out-' + side" />
      <handle type="target" [position]="side" [id]="'in-' + side" />
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      box-sizing: border-box;
      border: 3px solid var(--diagram-muted);
      pointer-events: none;
    }

    .label {
      position: absolute;
      top: 14px;
      left: 16px;
      font-family: var(--diagram-mono);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      opacity: 0.7;
    }
  `,
  host: {
    '[style.width.px]': 'data()?.width ?? 0',
    '[style.height.px]': 'data()?.height ?? 0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramFrame extends CustomNodeComponent<FrameData> {
  readonly sides = ['left', 'right', 'top', 'bottom'] as const;
}