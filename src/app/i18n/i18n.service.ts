import { Injectable, inject, isDevMode } from '@angular/core';

import { Lang, SettingsService } from '../core/services/settings.service';
import { IT } from './it';

type Dictionary = ReadonlyMap<string, string>;

const normalize = (text: string): string =>
    text.trim().replace(/\s+/g, ' ').toLowerCase();

function buildDictionary(entries: Record<string, string>): Dictionary {
    const map = new Map<string, string>();

    for (const [key, value] of Object.entries(entries)) {
        const normalized = normalize(key);

        if (isDevMode() && map.has(normalized)) {
            console.warn(`[i18n] chiave duplicata: "${key}"`);
        }

        map.set(normalized, value);
    }

    return map;
}

const DICTIONARIES: Partial<Record<Lang, Dictionary>> = {
    it: buildDictionary(IT),
};

function matchCase(source: string, translated: string): string {
    const letters = source.replace(/[^\p{L}]/gu, '');

    if (
        letters.length > 1 &&
        letters === letters.toUpperCase() &&
        letters !== letters.toLowerCase()
    ) {
        return translated.toUpperCase();
    }

    if (/^\p{Lu}{2}/u.test(translated)) {
        return translated;
    }

    const first = source.trim().charAt(0);
    const rest = translated.slice(1);

    if (first !== first.toUpperCase()) {
        return translated.charAt(0).toLocaleLowerCase() + rest;
    }

    if (first !== first.toLowerCase()) {
        return translated.charAt(0).toLocaleUpperCase() + rest;
    }

    return translated; // l'input inizia con cifra o simbolo
}

@Injectable({ providedIn: 'root' })
export class I18nService {
    private readonly settings = inject(SettingsService);
    private readonly warned = new Set<string>();

    readonly t = (text: string): string => {
        const dictionary = DICTIONARIES[this.settings.lang()];

        if (!dictionary) {
            return text;
        }

        const translated = dictionary.get(normalize(text));

        if (translated === undefined) {
            this.warnMissing(text);
            return text;
        }

        return matchCase(text, translated);
    };

    private warnMissing(text: string): void {
        if (isDevMode() && !this.warned.has(text)) {
            this.warned.add(text);
            console.warn(`[i18n] traduzione mancante: "${text}"`);
        }
    }
}