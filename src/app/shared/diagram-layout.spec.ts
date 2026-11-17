import { describe, expect, it } from 'vitest';

import { DiagramData, DiagramNode } from '../core/diagram.models';
import { computeLayout } from './diagram-layout';

function makeNode(id: string, position: [number, number], origin: DiagramNode['origin'] = 'container'): DiagramNode {
    return { id, label: id, stack: '', origin, kind: 'backend', position, profiles: [], hosts: [], uses: [] };
}

function makeData(nodes: DiagramNode[], edges: DiagramData['edges']): DiagramData {
    return { host: 'host', nodes, edges };
}

describe('computeLayout', () => {
    it('uses right and left handles between columns', () => {
        const layout = computeLayout(makeData([makeNode('a', [0, 0]), makeNode('b', [1, 0])], [{ from: 'a', to: 'b', label: null }]));
        expect(layout.edges[0]).toMatchObject({ sourceHandle: 'out-right', targetHandle: 'in-left' });
    });

    it('uses bottom and top handles inside a column', () => {
        const layout = computeLayout(makeData([makeNode('a', [0, 0]), makeNode('b', [0, 1])], [{ from: 'a', to: 'b', label: null }]));
        expect(layout.edges[0]).toMatchObject({ sourceHandle: 'out-bottom', targetHandle: 'in-top' });
    });

    it('drops edges that reference unknown nodes', () => {
        const layout = computeLayout(makeData([makeNode('a', [0, 0])], [{ from: 'a', to: 'x', label: null }]));
        expect(layout.edges).toEqual([]);
    });
});