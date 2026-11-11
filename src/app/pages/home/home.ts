import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EducationService, ExperieceService, LanguageService, PersonaService, ProjectService, TechnologyService } from '../../core/services';

import { JoinNamesPipe, OrdinalPipe } from '../../shared/pipes';

@Component({
  selector: 'app-home',
  imports: [RouterLink, JoinNamesPipe, OrdinalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly personaService = inject(PersonaService);
  private readonly languageService = inject(LanguageService);
  private readonly experienceService = inject(ExperieceService);
  private readonly projectService = inject(ProjectService);
  private readonly educationService = inject(EducationService);
  private readonly technologyService = inject(TechnologyService);

  protected readonly personal = this.personaService.personal;
  protected readonly overview = this.personaService.overview;
  protected readonly languages = this.languageService.languages;
  protected readonly projects = this.projectService.projects;
  protected readonly experiences = this.experienceService.experiences;
  protected readonly educations = this.educationService.educations;
  protected readonly technologies = this.technologyService.technologies;
}
