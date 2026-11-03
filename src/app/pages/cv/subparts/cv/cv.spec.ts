import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PortfolioService } from '../../../../core/portfolio.service';
import { Cv } from './cv';

const experience = (uuid: string, softSkills: string[]) => ({
    uuid,
    title: 'Developer',
    description: 'Description',
    company: { name: 'ACME' },
    start_date: '2020-10',
    end_date: null,
    technical_skills: [],
    soft_skills: softSkills.map((name) => ({ name })),
    technologies: [],
});

const portfolioStub = {
    personal: signal({ name: 'Mario', surname: 'Rossi', job_role: 'Developer', email: 'm@r.it' }),
    overview: signal({ text: 'Overview' }),
    languages: signal([{ uuid: 'l1', name: 'Italiano', level: 4 }]),
    educations: signal([
        {
            uuid: 'e1',
            institution: 'Universita',
            qualification: 'Laurea',
            field_of_study: 'Ingegneria',
            start_date: '2018-10-01',
            end_date: null,
            description: '',
        },
    ]),
    technologies: signal([
        { uuid: 't1', name: 'Python', typology: 'language', level: 5 },
        { uuid: 't2', name: 'Django', typology: 'framework', level: 3 },
    ]),
    experiences: signal([
        experience('x1', ['Teamwork', 'Networking']),
        experience('x2', ['Teamwork']),
    ]),
};

describe('Cv', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Cv],
            providers: [provideRouter([]), { provide: PortfolioService, useValue: portfolioStub }],
        }).compileComponents();
    });

    it('should render the full name', () => {
        const fixture = TestBed.createComponent(Cv);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('h1')?.textContent).toContain('Mario Rossi');
    });

    it('should group technologies by typology', () => {
        const fixture = TestBed.createComponent(Cv);
        fixture.detectChanges();
        const groups = (fixture.nativeElement as HTMLElement).querySelectorAll('.group');
        expect(groups.length).toBe(2);
    });

    it('should render a level meter for each language and technology', () => {
        const fixture = TestBed.createComponent(Cv);
        fixture.detectChanges();
        const meters = (fixture.nativeElement as HTMLElement).querySelectorAll('app-level-meter');
        expect(meters.length).toBe(3);
    });

    it('should list each soft skill once', () => {
        const fixture = TestBed.createComponent(Cv);
        fixture.detectChanges();
        const items = (fixture.nativeElement as HTMLElement).querySelectorAll('#soft-title ~ .bullets li');
        expect(items.length).toBe(2);
    });
});