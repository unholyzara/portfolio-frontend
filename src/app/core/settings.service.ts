import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';
export const LANGUAGES = ['it', 'en'] as const;
export type Lang = (typeof LANGUAGES)[number];

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly doc = inject(DOCUMENT);

  readonly languages = LANGUAGES;

  readonly theme = signal<Theme>(this.initialTheme());
  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    effect(() => {
      this.doc.documentElement.dataset['theme'] = this.theme();
    });

    effect(() => {
      this.doc.documentElement.lang = this.lang();
      this.write('lang', this.lang());
    });

    this.themeMedia?.addEventListener('change', event => {
      if (!this.hasThemeOverride) {
        this.theme.set(event.matches ? 'light' : 'dark');
      }
    });
  }

  private readonly themeMedia = this.doc.defaultView?.matchMedia?.(
    '(prefers-color-scheme: light)',
  );

  private hasThemeOverride =
    this.read('theme') === 'dark' || this.read('theme') === 'light';

  toggleTheme(): void {
    this.hasThemeOverride = true;

    this.theme.update(value => (value === 'dark' ? 'light' : 'dark'));

    this.write('theme', this.theme());
  }

  useSystemTheme(): void {
    this.hasThemeOverride = false;

    try {
      this.doc.defaultView?.localStorage.removeItem('theme');
    } catch {
      // localStorage non disponibile
    }

    this.theme.set(this.themeMedia?.matches ? 'light' : 'dark');
  }

  toggleLang(): void {
    this.lang.update(current => {
      const index = LANGUAGES.indexOf(current);
      return LANGUAGES[(index + 1) % LANGUAGES.length];
    });
  }

  private initialLang(): Lang {
    const stored = this.read('lang');

    if (LANGUAGES.includes(stored as Lang)) {
      return stored as Lang;
    }

    const browserLanguages = this.doc.defaultView?.navigator.languages;
    const languages = browserLanguages?.length
      ? browserLanguages
      : [this.doc.defaultView?.navigator.language ?? ''];

    for (const language of languages) {
      const baseLanguage = language.toLowerCase().split('-')[0];
      const supported = LANGUAGES.find(lang => lang === baseLanguage);

      if (supported) {
        return supported;
      }
    }

    return LANGUAGES[0];
  }

  private initialTheme(): Theme {
    const stored = this.read('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    const prefersLight = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: light)')?.matches;
    return prefersLight ? 'light' : 'dark';
  }

  private read(key: string): string | null {
    try {
      return this.doc.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      this.doc.defaultView?.localStorage.setItem(key, value);
    } catch {
      return;
    }
  }
}
