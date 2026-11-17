import { DiagramData, DiagramEdge, DiagramNode } from '../core/diagram.models';

// ATTENZIONE: tieni qui i valori che usi oggi nel tuo file (CARD_HEIGHT e GAP_Y sono stati
// modificati rispetto alla versione che mi hai mandato). CARD_WIDTH e GAP_X devono restare
// uguali a quelli di validate_layout.py.
export const CARD_WIDTH = 240;
export const CARD_HEIGHT = 240;
export const GAP_X = 64;
export const GAP_Y = 48;
const MARGIN = 24;
const GROUP_PADDING = 20;
const GROUP_HEADER = 40;

const KIND_LABELS: Record<string, string> = { platform: 'proxy' };

/** Edge types that are in the data but not drawn (the frame already says it). Keep in sync with validate_layout.py. */
const HIDDEN_EDGE_TYPES = ['runs_on'];

type Side = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITE: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

export interface PlacedNode extends DiagramNode {
    x: number;
    y: number;
    tag: string;
    chips: string[];
}

export interface LayoutEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    label: string | null;
}

export interface Frame {
    /** Id of the host node (e.g. the EC2 Spot): edges to the host attach to the frame. */
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Layout {
    width: number;
    height: number;
    host: string;
    nodes: PlacedNode[];
    edges: LayoutEdge[];
    group: Frame | null;
}

interface GridBox {
    minCol: number;
    maxCol: number;
    minRow: number;
    maxRow: number;
}

function tagOf(node: DiagramNode): string {
    if (node.origin !== 'container') {
        return node.origin;
    }
    return `container · ${KIND_LABELS[node.kind] ?? node.kind}`;
}

function placeNode(node: DiagramNode): PlacedNode {
    const [col, row] = node.position;
    const uses = node.uses === undefined ? [] : node.uses;
    const profiles = node.profiles === undefined ? [] : node.profiles;
    return {
        ...node,
        x: MARGIN + col * (CARD_WIDTH + GAP_X),
        y: MARGIN + GROUP_HEADER + GROUP_PADDING + row * (CARD_HEIGHT + GAP_Y),
        tag: tagOf(node),
        chips: [...uses, ...profiles.map((profile) => `profile: ${profile}`)],
    };
}

/** The node that runs the containers: the most common target of `runs_on` edges. */
function findHostId(edges: DiagramEdge[]): string | null {
    const counts = new Map<string, number>();
    for (const edge of edges) {
        if (edge.types?.includes('runs_on')) {
            counts.set(edge.to, (counts.get(edge.to) ?? 0) + 1);
        }
    }
    let best: string | null = null;
    for (const [id, count] of counts) {
        if (best === null || count > (counts.get(best) ?? 0)) {
            best = id;
        }
    }
    return best;
}

function handlesFor(source: PlacedNode, target: PlacedNode) {
    if (source.position[0] === target.position[0]) {
        return target.y > source.y
            ? { sourceHandle: 'out-bottom', targetHandle: 'in-top' }
            : { sourceHandle: 'out-top', targetHandle: 'in-bottom' };
    }
    return target.x > source.x
        ? { sourceHandle: 'out-right', targetHandle: 'in-left' }
        : { sourceHandle: 'out-left', targetHandle: 'in-right' };
}

function gridBoxOf(nodes: PlacedNode[]): GridBox | null {
    if (nodes.length === 0) {
        return null;
    }
    const cols = nodes.map((node) => node.position[0]);
    const rows = nodes.map((node) => node.position[1]);
    return {
        minCol: Math.min(...cols),
        maxCol: Math.max(...cols),
        minRow: Math.min(...rows),
        maxRow: Math.max(...rows),
    };
}

/** Side of the frame that faces a node outside it (vertical first, same rule as validate_layout.py). */
function frameSideFacing(node: PlacedNode, box: GridBox): Side {
    const [col, row] = node.position;
    if (row > box.maxRow) {
        return 'bottom';
    }
    if (row < box.minRow) {
        return 'top';
    }
    return col < box.minCol ? 'left' : 'right';
}

function frameOf(nodes: PlacedNode[], id: string): Frame | null {
    if (nodes.length === 0) {
        return null;
    }
    const left = Math.min(...nodes.map((node) => node.x)) - GROUP_PADDING;
    const top = Math.min(...nodes.map((node) => node.y)) - GROUP_PADDING - GROUP_HEADER;
    const right = Math.max(...nodes.map((node) => node.x + CARD_WIDTH)) + GROUP_PADDING;
    const bottom = Math.max(...nodes.map((node) => node.y + CARD_HEIGHT)) + GROUP_PADDING;
    return { id, x: left, y: top, width: right - left, height: bottom - top };
}

export function computeLayout(data: DiagramData): Layout {
    const hostId = findHostId(data.edges);
    const hostNode = data.nodes.find((node) => node.id === hostId);

    // The host is not a card: it is drawn as the frame around the containers.
    const nodes = data.nodes.filter((node) => node.id !== hostId).map(placeNode);
    const byId = new Map(nodes.map((node) => [node.id, node]));

    const containers = nodes.filter((node) => node.origin === 'container');
    const box = gridBoxOf(containers);
    const group = frameOf(containers, hostId ?? 'frame');

    const edges = data.edges.flatMap((edge, index): LayoutEdge[] => {
        if (edge.types?.some((type) => HIDDEN_EDGE_TYPES.includes(type))) {
            return [];
        }
        const id = `${edge.from}-${edge.to}-${index}`;
        const fromHost = hostId !== null && edge.from === hostId;
        const toHost = hostId !== null && edge.to === hostId;

        if (fromHost && toHost) {
            return [];
        }

        if (fromHost || toHost) {
            const other = byId.get(fromHost ? edge.to : edge.from);
            if (!other || !box) {
                return [];
            }
            const frameSide = frameSideFacing(other, box);
            const nodeSide = OPPOSITE[frameSide];
            return [
                fromHost
                    ? {
                        id,
                        source: edge.from,
                        target: edge.to,
                        label: edge.label,
                        sourceHandle: `out-${frameSide}`,
                        targetHandle: `in-${nodeSide}`,
                    }
                    : {
                        id,
                        source: edge.from,
                        target: edge.to,
                        label: edge.label,
                        sourceHandle: `out-${nodeSide}`,
                        targetHandle: `in-${frameSide}`,
                    },
            ];
        }

        const source = byId.get(edge.from);
        const target = byId.get(edge.to);
        if (!source || !target) {
            return [];
        }
        return [{ id, source: edge.from, target: edge.to, label: edge.label, ...handlesFor(source, target) }];
    });

    const right = Math.max(0, group ? group.x + group.width : 0, ...nodes.map((node) => node.x + CARD_WIDTH));
    const bottom = Math.max(0, group ? group.y + group.height : 0, ...nodes.map((node) => node.y + CARD_HEIGHT));
    return {
        width: right + MARGIN,
        height: bottom + MARGIN,
        host: data.host || hostNode?.label || '',
        nodes,
        edges,
        group,
    };
}