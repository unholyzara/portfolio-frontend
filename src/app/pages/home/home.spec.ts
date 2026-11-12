import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  Company,
  Education,
  Overview,
  PersonalInfo,
  Project,
  Skill,
  SpokenLanguage,
  Technology,
  WorkExperience
} from '../../core/models';
import { EducationService, ExperieceService, PersonaService, ProjectService, TechnologyService } from '../../core/services';
import { Home } from './home';

const range = <T>(length: number, build: (index: number) => T): T[] =>
  Array.from({ length }, (_, index) => build(index));

const PERSONAL_INFO: PersonalInfo = {
  name: '[Name]',
  surname: '[Surname]',
  job_role: 'job_role',
  email: 'email',
  phone_number: 'xxxxx',
  location: "Padua, Italy"
};
const OVERVIEW: Overview = { short_text: "short_text", text: 'text' };
const SPOKEN_LANGUAGES: SpokenLanguage[] = range(2, (i) => ({
  uuid: `uuid-${i}`,
  id: `l${i}`,
  name: 'english',
  level: '4',
}));
const EDUCATIONS: Education[] = range(2, (i) => ({
  uuid: `uuid-${i}`,
  institution: `institution ${i}`,
  qualification: `qualification ${i}`,
  field_of_study: `field_of_study ${i}`,
  start_date: `01/01/202${i}`,
  end_date: `01/01/202${i + 1}`,
  description: `description ${i}`,
}));
const TECHNOLOGIES: Technology[] = range(8, (i) => ({
  uuid: `uuid-${i}`,
  name: `name ${i}`,
  typology_display: 'tool',
  level: '4',
}));
const COMPANY: Company = {
  uuid: 'c0',
  name: 'name',
  website: null,
};
const skills = (typology: Skill['typology'], length: number): Skill[] =>
  range(length, (i) => ({
    uuid: `${typology}${i}`,
    name: `Skill.name · ${typology}`,
    description: null,
    typology,
  }));
const WORK_EXPERIENCES: WorkExperience[] = range(3, (i) => ({
  uuid: `uuid-${i}`,
  title: `title ${i}`,
  description: `description ${i}`,
  company: COMPANY,
  start_date: `01/01/202${i + 5}`,
  end_date: `01/01/202${i + 6}`,
  technical_skills: skills('technical', 4),
  soft_skills: skills('soft', 3),
  technologies: TECHNOLOGIES.slice(0, 4),
}));
const PROJECTS: Project[] = range(3, (i) => ({
  uuid: `uuid-${i}`,
  in_homepage: true,
  title: `title ${i}`,
  description: `description ${i}`,
  technologies: TECHNOLOGIES.slice(0, 5),
  work_experience: WORK_EXPERIENCES[i],
}));

const personaStub = {
  personal: signal(PERSONAL_INFO),
  overview: signal(OVERVIEW),
  languages: signal(SPOKEN_LANGUAGES),
}

const educationStub = {
  educations: signal(EDUCATIONS),
}

const technologyStub = {
  technologies: signal(TECHNOLOGIES),
}

const experienceStub = {
  experiences: signal(WORK_EXPERIENCES),
}

const projectStub = {
  projects: signal(PROJECTS),
}

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: PersonaService, useValue: personaStub },
        { provide: EducationService, useValue: educationStub },
        { provide: TechnologyService, useValue: technologyStub },
        { provide: ExperieceService, useValue: experienceStub },
        { provide: ProjectService, useValue: projectStub },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one row for each project', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('#progetti .card');
    expect(rows.length).toBe(PROJECTS.length);
  });
});