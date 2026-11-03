import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Cv } from './subparts/cv/cv';

@Component({
    selector: 'app-cv-page',
    imports: [Cv],
    templateUrl: './cv-page.html',
    styleUrl: './cv-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvPage {
    private readonly document = inject(DOCUMENT);

    protected async print(): Promise<void> {
        const cv = this.document.querySelector('app-cv');
        if (!cv) {
            return;
        }

        const frame = this.document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = 'position:fixed;width:0;height:0;border:0;';

        const loaded = new Promise<void>((resolve) =>
            frame.addEventListener('load', () => resolve(), { once: true }),
        );
        frame.src = 'print-cv.html';
        this.document.body.appendChild(frame);
        await loaded;

        const frameWindow = frame.contentWindow!;
        const frameDocument = frameWindow.document;
        frameDocument.documentElement.lang = this.document.documentElement.lang || 'it';

        const appStyles = [...this.document.head.querySelectorAll('style, link[rel="stylesheet"]')].map(
            (node) => frameDocument.importNode(node, true),
        );
        const stylesLoaded = appStyles
            .filter((node) => node.nodeName === 'LINK')
            .map(
                (link) =>
                    new Promise<void>((resolve) => {
                        link.addEventListener('load', () => resolve(), { once: true });
                        link.addEventListener('error', () => resolve(), { once: true });
                    }),
            );

        frameDocument.head.querySelector('style')!.before(...appStyles);
        frameDocument.body.append(frameDocument.importNode(cv, true));

        await Promise.all(stylesLoaded);
        await frameDocument.fonts.ready;

        frameWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
        frameWindow.focus();
        frameWindow.print();
    }
}