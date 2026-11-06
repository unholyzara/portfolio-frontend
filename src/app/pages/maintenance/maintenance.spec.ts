import { TestBed } from '@angular/core/testing';

import { SettingsService } from '../../core/settings.service';
import { Maintenance } from './maintenance';

describe('Maintenance', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Maintenance] }).compileComponents();
    });

    it('should render the title in italian', () => {
        TestBed.inject(SettingsService).lang.set('it');
        const fixture = TestBed.createComponent(Maintenance);
        fixture.detectChanges();
        const title = (fixture.nativeElement as HTMLElement).querySelector('h1');
        expect(title?.textContent).toContain('In manutenzione');
    });

    it('should render the title in english', () => {
        TestBed.inject(SettingsService).lang.set('en');
        const fixture = TestBed.createComponent(Maintenance);
        fixture.detectChanges();
        const title = (fixture.nativeElement as HTMLElement).querySelector('h1');
        expect(title?.textContent).toContain('Under maintenance');
    });

    it('should render a retry button', () => {
        const fixture = TestBed.createComponent(Maintenance);
        fixture.detectChanges();
        const button = (fixture.nativeElement as HTMLElement).querySelector('.btn--accent');
        expect(button).toBeTruthy();
    });
});