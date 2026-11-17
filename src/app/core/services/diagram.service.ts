import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { DiagramData } from '../diagram.models';

const DIAGRAM_URL = '/diagram/architecture.json';

export type DiagramState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ready'; data: DiagramData }
    | { status: 'error' };

function isDiagramData(value: unknown): value is DiagramData {
    const candidate = value as Partial<DiagramData> | null;
    return Array.isArray(candidate?.nodes) && Array.isArray(candidate?.edges);
}

@Injectable({ providedIn: 'root' })
export class DiagramService {
    private readonly http = inject(HttpClient);
    private readonly current = signal<DiagramState>({ status: 'idle' });

    readonly state = this.current.asReadonly();

    load(): void {
        const { status } = this.current();
        if (status === 'loading' || status === 'ready') {
            return;
        }
        this.current.set({ status: 'loading' });
        this.http.get<DiagramData>(DIAGRAM_URL).subscribe({
            next: (data) =>
                this.current.set(isDiagramData(data) ? { status: 'ready', data } : { status: 'error' }),
            error: () => this.current.set({ status: 'error' }),
        });
    }
}