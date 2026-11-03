import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { Technology } from '../../../../core/models';
import { PortfolioService } from '../../../../core/portfolio.service';
import { Icon } from '../../../../shared/icon/icon';
import { LevelMeter } from '../../../../shared/level-meter/level-meter';

const TYPOLOGY_LABELS: Record<string, string> = {
    language: 'Linguaggi',
    framework: 'Framework',
    library: 'Librerie',
    markup: 'Markup',
    stylesheet: 'Stylesheet',
    tool: 'Strumenti',
    database: 'Database',
};

@Component({
    selector: 'app-cv',
    imports: [DatePipe, LevelMeter, Icon],
    templateUrl: './cv.html',
    styleUrl: './cv.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cv {
    private readonly portfolio = inject(PortfolioService);

    protected readonly personal = this.portfolio.personal;
    protected readonly overview = this.portfolio.overview;
    protected readonly languages = this.portfolio.languages;
    protected readonly educations = this.portfolio.educations;
    protected readonly experiences = this.portfolio.experiences;

    protected readonly technologyGroups = computed(() => {
        const groups = new Map<string, Technology[]>();
        for (const technology of this.portfolio.technologies()) {
            groups.set(technology.typology_display, [...(groups.get(technology.typology_display) ?? []), technology]);
        }
        return [...groups].map(([typology, items]) => ({
            label: TYPOLOGY_LABELS[typology] ?? typology,
            items,
        }));
    });

    protected readonly softSkills = computed(() => [
        ...new Set(
            this.portfolio
                .experiences()
                .flatMap((experience) => experience.soft_skills.map((skill) => skill.name)),
        ),
    ]);

    protected readonly experienceResponsibilities = (uuid: string) =>
        this.portfolio.experienceResponsibilities(uuid);

    protected readonly timelineEducations = computed(() =>
        [...this.portfolio.educations()].sort(
            (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
        ),
    );
}