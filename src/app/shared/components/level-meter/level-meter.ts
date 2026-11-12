import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'app-level-meter',
  templateUrl: './level-meter.html',
  styleUrl: './level-meter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelMeter {
  readonly level = input<number, unknown>(0, {
    transform: (value) => numberAttribute(value, 0),
  });
  readonly max = input(5);

  protected readonly filled = computed(() =>
    Math.min(Math.max(Math.round(this.level()), 0), this.max()),
  );

  protected readonly steps = computed(() =>
    Array.from({ length: this.max() }, (_, index) => index < this.filled()),
  );
}