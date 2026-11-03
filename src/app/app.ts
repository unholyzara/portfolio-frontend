import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { SettingsService } from './core/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly settings = inject(SettingsService);

  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected async scrollToSection(id: string, event: MouseEvent): Promise<void> {
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