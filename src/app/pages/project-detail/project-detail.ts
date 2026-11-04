import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PortfolioService } from '../../core/portfolio.service';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly portfolio = inject(PortfolioService);

  readonly uuid = input.required<string>();

  protected readonly loaded = this.portfolio.loaded
  protected readonly project = computed(() => this.portfolio.project(this.uuid()));
  protected readonly repositories = computed(() => this.portfolio.projectRepositories(this.uuid()));

  protected readonly pager = computed(() =>
    this.portfolio.neighbours(this.portfolio.projects(), this.uuid()),
  );
}
