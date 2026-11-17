import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input } from '@angular/core';
import { Vflow, createEdge, createNode } from 'ngx-vflow';

import { DiagramService } from '../../../core/services/diagram.service';
import { computeLayout } from '../../diagram-layout';
import { DiagramCard } from './diagram-card';
import { DiagramFrame } from './diagram-frame';

@Component({
    selector: 'app-diagram',
    imports: [Vflow],
    templateUrl: './diagram.html',
    styleUrl: './diagram.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diagram implements OnInit {
    private readonly service = inject(DiagramService);

    readonly ariaLabel = input('Architecture diagram');
    readonly errorLabel = input('Diagram unavailable');

    readonly chart = computed(() => {
        const state = this.service.state();
        if (state.status !== 'ready') {
            return null;
        }
        const layout = computeLayout(state.data);
        const frame = layout.group
            ? [
                createNode({
                    // same id as the host node: edges to the host attach to the frame
                    id: layout.group.id,
                    point: { x: layout.group.x, y: layout.group.y },
                    type: DiagramFrame,
                    data: { label: layout.host, width: layout.group.width, height: layout.group.height },
                    draggable: false,
                }),
            ]
            : [];
        const cards = layout.nodes.map((node) => {
            const profiles = node.profiles === undefined ? [] : node.profiles;
            return createNode({
                id: node.id,
                point: { x: node.x, y: node.y },
                type: DiagramCard,
                data: {
                    label: node.label,
                    tag: node.tag,
                    stack: node.stack,
                    kind: node.kind,
                    hosts: node.hosts,
                    chips: node.chips,
                    optional: profiles.length > 0,
                },
                draggable: false,
            });
        });
        const edges = layout.edges.map((edge) =>
            createEdge({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                curve: 'smooth-step',
                markers: { end: { type: 'arrow-closed' } },
                edgeLabels: edge.label ? { center: { type: 'default', text: edge.label } } : undefined,
            }),
        );
        return { nodes: [...frame, ...cards], edges, ratio: `${layout.width} / ${layout.height}` };
    });

    readonly failed = computed(() => this.service.state().status === 'error');

    ngOnInit(): void {
        this.service.load();
    }
}