import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PortfolioService } from '../../core/portfolio.service';

@Component({
  selector: 'app-experience-detail',
  imports: [RouterLink],
  templateUrl: './experience-detail.html',
  styleUrl: './experience-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDetail {
  private readonly portfolio = inject(PortfolioService);

  readonly uuid = input.required<string>();

  protected readonly loaded = this.portfolio.loaded
  protected readonly experience = computed(() => this.portfolio.experience(this.uuid()));
  protected readonly responsibilities = computed(() => this.portfolio.experienceResponsibilities(this.uuid()));
  protected readonly projects = computed(() => this.portfolio.projectsOf(this.uuid()));

  protected readonly pager = computed(() =>
    this.portfolio.neighbours(this.portfolio.experiences(), this.uuid()),
  );

  protected joinNames(items: readonly { name: string }[]): string {
    return items.map((item) => item.name).join(' · ');
  }

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
