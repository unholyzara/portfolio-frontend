import { TestBed } from '@angular/core/testing';

import { Maintenance } from './maintenance';

describe('Maintenance', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Maintenance] }).compileComponents();
    });

    it('should render the title in english', () => {
        const fixture = TestBed.createComponent(Maintenance);
        fixture.detectChanges();
        const title = (fixture.nativeElement as HTMLElement).querySelector('h1');
        expect(title?.textContent).toContain('Under Maintenance');
    });

    it('should render a retry button', () => {
        const fixture = TestBed.createComponent(Maintenance);
        fixture.detectChanges();
        const button = (fixture.nativeElement as HTMLElement).querySelector('.btn--accent');
        expect(button).toBeTruthy();
    });
});