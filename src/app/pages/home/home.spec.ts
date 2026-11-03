import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  EDUCATIONS,
  OVERVIEW,
  PERSONAL_INFO,
  PROJECTS,
  SPOKEN_LANGUAGES,
  TECHNOLOGIES,
  WORK_EXPERIENCES,
} from '../../core/placeholder.data';
import { PortfolioService } from '../../core/portfolio.service';
import { Home } from './home';

const portfolioStub = {
  personal: signal(PERSONAL_INFO),
  overview: signal(OVERVIEW),
  languages: signal(SPOKEN_LANGUAGES),
  educations: signal(EDUCATIONS),
  technologies: signal(TECHNOLOGIES),
  experiences: signal(WORK_EXPERIENCES),
  projects: signal(PROJECTS),
};

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), { provide: PortfolioService, useValue: portfolioStub }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one row for each project', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('#progetti .row');
    expect(rows.length).toBe(PROJECTS.length);
  });
});