import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DiagramService } from './diagram.service';

const URL = '/diagram/architecture.json';
const VALID_DIAGRAM = {
    host: 'portfolio',
    nodes: [],
    edges: [],
};

describe('DiagramService', () => {
    let service: DiagramService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DiagramService);
        http = TestBed.inject(HttpTestingController);
    });

    it('becomes ready when the response is valid diagram data', () => {
        service.load();
        http.expectOne(URL).flush(VALID_DIAGRAM);
        expect(service.state().status).toBe('ready');
    });

    it('becomes error when the response is not valid diagram data', () => {
        service.load();
        http.expectOne(URL).flush({ host: 'portfolio' });
        expect(service.state().status).toBe('error');
    });

    it('does not request twice while loading', () => {
        service.load();
        service.load();
        http.expectOne(URL);
    });
});