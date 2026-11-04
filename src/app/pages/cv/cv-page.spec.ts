// cv-page.spec.ts
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PortfolioService } from '../../core/portfolio.service';
import { CvPage } from './cv-page';

describe('CvPage', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvPage],
            providers: [
                provideRouter([]),
                {
                    provide: PortfolioService, useValue: {
                        personal: signal({ name: '', surname: '', job_role: '', email: '', phone_number: '' }),
                        overview: signal({ text: '' }),
                        languages: signal([]),
                        educations: signal([]),
                        technologies: signal([]),
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