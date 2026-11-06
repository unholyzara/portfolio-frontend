import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectService } from '../../core/services';
import { pagerOf } from '../../shared/utils';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly projectService = inject(ProjectService);

  readonly uuid = input.required<string>();

  protected readonly loaded = this.projectService.loaded
  protected readonly project = computed(() => this.projectService.project(this.uuid()));
  protected readonly repositories = computed(() => this.projectService.projectRepositories(this.uuid()));

  protected readonly pager = pagerOf(this.projectService.projects, this.uuid);
}
