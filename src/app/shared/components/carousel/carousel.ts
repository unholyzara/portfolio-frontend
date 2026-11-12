import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel {
  readonly label = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly canPrev = signal(false);
  protected readonly canNext = signal(false);

  constructor() {
    afterNextRender(() => {
      const track = this.track().nativeElement;
      const update = () => this.update();
      const resizeObserver = new ResizeObserver(update);
      const mutationObserver = new MutationObserver(update);

      resizeObserver.observe(track);
      mutationObserver.observe(track, { childList: true });
      this.destroyRef.onDestroy(() => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      });

      update();
    });
  }

  protected update(): void {
    const track = this.track().nativeElement;
    this.canPrev.set(track.scrollLeft > 1);
    this.canNext.set(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  }

  protected scroll(direction: 1 | -1): void {
    const track = this.track().nativeElement;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (track.clientWidth + gap) });
  }
}
