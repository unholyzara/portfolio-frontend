import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { Technology } from '../../../../core/models';
import { EducationService, ExperieceService, LanguageService, PersonaService, TechnologyService } from '../../../../core/services';
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
    private readonly personaService = inject(PersonaService);
    private readonly languageService = inject(LanguageService);
    private readonly educationService = inject(EducationService);
    private readonly experienceService = inject(ExperieceService);
    private readonly technologyService = inject(TechnologyService);

    protected readonly personal = this.personaService.personal;
    protected readonly overview = this.personaService.overview;
    protected readonly languages = this.languageService.languages;
    protected readonly educations = this.educationService.educations;
    protected readonly experiences = this.experienceService.experiences;

    protected readonly technologyGroups = computed(() => {
        const groups = new Map<string, Technology[]>();
        for (const technology of this.technologyService.technologies()) {
            groups.set(technology.typology_display, [...(groups.get(technology.typology_display) ?? []), technology]);
        }
        return [...groups].map(([typology, items]) => ({
            label: TYPOLOGY_LABELS[typology] ?? typology,
            items,
        }));
    });

    protected readonly softSkills = computed(() => [
        ...new Set(
            this.experienceService
                .experiences()
                .flatMap((experience) => experience.soft_skills.map((skill) => skill.name)),
        ),
    ]);

    protected readonly experienceResponsibilities = (uuid: string) =>
        this.experienceService.experienceResponsibilities(uuid);

    protected readonly timelineEducations = computed(() =>
        [...this.educationService.educations()].sort(
            (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
        ),
    );
}