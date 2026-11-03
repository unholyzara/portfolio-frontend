import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';


import { PortfolioService } from '../../core/portfolio.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly portfolio = inject(PortfolioService);

  protected readonly personal = this.portfolio.personal;
  protected readonly overview = this.portfolio.overview;
  protected readonly languages = this.portfolio.languages;
  protected readonly projects = this.portfolio.projects;
  protected readonly experiences = this.portfolio.experiences;
  protected readonly educations = this.portfolio.educations;
  protected readonly technologies = this.portfolio.technologies;

  protected joinNames(items: readonly { name: string }[]): string {
    return items.map((item) => item.name).join(' · ');
  }

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
