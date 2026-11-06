
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SettingsService } from './core/services/settings.service';
import { Maintenance } from './pages/maintenance/maintenance';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Maintenance],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly settings = inject(SettingsService);

  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.settings.status().maintenance) {
        this.redirectIfNeeded();
      }
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.redirectIfNeeded());
  }

  private redirectIfNeeded(): void {
    if (
      this.settings.status().maintenance &&
      this.router.url !== '/'
    ) {
      void this.router.navigateByUrl('/');
    }
  }

  protected async scrollToSection(
    id: string,
    event: MouseEvent,
  ): Promise<void> {
    event.preventDefault();

    if (this.router.url !== '/') {
      const navigated = await this.router.navigateByUrl('/');

      if (!navigated) return;
    }

    const view = this.doc.defaultView;

    view?.requestAnimationFrame(() => {
      view.requestAnimationFrame(() => {
        this.doc.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }
}
