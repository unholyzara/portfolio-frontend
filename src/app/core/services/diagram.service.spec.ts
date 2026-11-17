import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DiagramService } from './diagram.service';

const URL = '/diagram/architecture.svg';

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

    it('becomes ready when the response is an svg', () => {
        service.load();
        http.expectOne(URL).flush('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        expect(service.state().status).toBe('ready');
    });

    it('becomes error when the response is not an svg', () => {
        service.load();
        http.expectOne(URL).flush('<!doctype html><html></html>');
        expect(service.state().status).toBe('error');
    });

    it('does not request twice while loading', () => {
        service.load();
        service.load();
        http.expectOne(URL);
    });
});