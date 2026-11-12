import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ExperieceService, ProjectService } from '../../core/services';

import { Carousel } from '../../shared/components/carousel';
import { JoinNamesPipe, OrdinalPipe } from '../../shared/pipes';
import { pagerOf } from '../../shared/utils';

@Component({
  selector: 'app-experience-detail',
  imports: [RouterLink, Carousel, OrdinalPipe, JoinNamesPipe],
  templateUrl: './experience-detail.html',
  styleUrl: './experience-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDetail {
  private readonly experienceService = inject(ExperieceService);
  private readonly projectService = inject(ProjectService);

  readonly uuid = input.required<string>();

  protected readonly experience = computed(() => this.experienceService.experience(this.uuid()));
  protected readonly responsibilities = computed(() => this.experienceService.experienceResponsibilities(this.uuid()));
  protected readonly projects = computed(() => this.projectService.projectsOf(this.uuid()));

  readonly loaded = computed(() =>
    this.experienceService.loaded() && this.projectService.loaded()
  );

  protected readonly pager = pagerOf(this.experienceService.experiences, this.uuid);
}
