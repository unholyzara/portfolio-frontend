import { TestBed } from '@angular/core/testing';

import { LevelMeter } from './level-meter';

describe('LevelMeter', () => {
    const render = (level: unknown, max?: number) => {
        const fixture = TestBed.createComponent(LevelMeter);
        fixture.componentRef.setInput('level', level);
        if (max !== undefined) {
            fixture.componentRef.setInput('max', max);
        }
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [LevelMeter] }).compileComponents();
    });

    it('should render five squares with the given level highlighted', () => {
        const element = render(3);
        expect(element.querySelectorAll('.meter__step').length).toBe(5);
        expect(element.querySelectorAll('.meter__step--on').length).toBe(3);
    });

    it('should clamp the level to the maximum', () => {
        const element = render(9);
        expect(element.querySelectorAll('.meter__step--on').length).toBe(5);
    });

    it('should treat a non numeric level as zero', () => {
        const element = render('senior');
        expect(element.querySelectorAll('.meter__step--on').length).toBe(0);
    });

    it('should expose the level to assistive technologies', () => {
        const element = render(4);
        expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Livello 4 su 5');
    });
});