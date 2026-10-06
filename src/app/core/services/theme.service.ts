import { Injectable } from '@angular/core';


export type AppTheme =
  'light' |
  'dark' |
  'system';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme:
    AppTheme =
    'system';


  private mediaQuery =
    window.matchMedia(
      '(prefers-color-scheme: dark)'
    );


  constructor() {

    this.mediaQuery
      .addEventListener(
        'change',
        () => {

          if (
            this.currentTheme ===
            'system'
          ) {

            this.applySystemTheme();

          }

        }
      );

  }


  /* ============================
     SET THEME
  ============================ */

  setTheme(
    theme: AppTheme
  ): void {

    this.currentTheme =
      theme;


    if (
      theme ===
      'system'
    ) {

      this.applySystemTheme();

      return;

    }


    this.applyTheme(
      theme
    );

  }


  /* ============================
     APPLY SYSTEM THEME
  ============================ */

  private applySystemTheme(): void {

    const systemTheme:
      'light' | 'dark' =

      this.mediaQuery.matches
        ? 'dark'
        : 'light';


    this.applyTheme(
      systemTheme
    );

  }


  /* ============================
     APPLY THEME
  ============================ */

  private applyTheme(
    theme: 'light' | 'dark'
  ): void {

    document
      .documentElement
      .setAttribute(
        'data-theme',
        theme
      );

  }


  /* ============================
     GET SELECTED THEME
  ============================ */

  getTheme(): AppTheme {

    return this.currentTheme;

  }

}