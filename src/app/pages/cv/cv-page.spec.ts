// cv-page.spec.ts
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EducationService, ExperieceService, PersonaService, TechnologyService } from '../../core/services';
import { CvPage } from './cv-page';

describe('CvPage', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvPage],
            providers: [
                provideRouter([]),
                {
                    provide: PersonaService, useValue: {
                        personal: signal({ name: '', surname: '', job_role: '', email: '', phone_number: '' }),
                        overview: signal({ text: '' }),
                        languages: signal([]),
                    },
                },
                {
                    provide: EducationService, useValue: {
                        educations: signal([]),
                    },
                },
                {
                    provide: TechnologyService, useValue: {
                        technologies: signal([]),
                    },
                },
                {
                    provide: ExperieceService, useValue: {
                        experiences: signal([]),
                    },
                },
            ],
        }).compileComponents();
    });

    it('should render the cv component', () => {
        const fixture = TestBed.createComponent(CvPage);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('app-cv')).not.toBeNull();
    });

    it('should call window.print on click', async () => {
        const fixture = TestBed.createComponent(CvPage);
        fixture.detectChanges();
        const component = fixture.componentInstance;
        const printSpy = vi.spyOn(component, 'print').mockResolvedValue();

        (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.cv-page__print')!.click();

        expect(printSpy).toHaveBeenCalledTimes(1);
    });
});