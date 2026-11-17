export type NodeOrigin = 'container' | 'aws' | 'client';

export interface DiagramNode {
    id: string;
    label: string;
    stack: string;
    origin: NodeOrigin;
    kind: string;
    position: [number, number];
    profiles: string[];
    hosts: string[];
    uses: string[];
}

export interface DiagramEdge {
    from: string;
    to: string;
    label: string | null;
    types?: string[];
}

export interface DiagramData {
    host: string;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
}

export interface CardData {
    label: string;
    tag: string;
    stack: string;
    kind: string;
    hosts: string[];
    chips: string[];
    optional: boolean;
}

export interface FrameData {
    label: string;
    width: number;
    height: number;
}