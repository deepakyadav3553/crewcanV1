import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ColorUtilsService } from './color-utils.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';

export interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  isDark: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private colorUtils = inject(ColorUtilsService);

  // Signals for reactive theme management
  public currentTheme = signal<ThemeConfig>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    isDark: false
  });

  public isDarkMode = signal<boolean>(false);

  private observer: MutationObserver | null = null;
  private mediaQuery: MediaQueryList;

  constructor() {
    // Listen for system dark mode changes
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode.set(this.mediaQuery.matches);

    this.mediaQuery.addEventListener('change', (e) => {
      this.isDarkMode.set(e.matches);
    });

    // Initialize mobile features
    this.initializeMobileFeatures();

    // Effect to update status bar when theme changes
    effect(() => {
      const theme = this.currentTheme();
      this.updateStatusBarForTheme(theme);
    });

    // Start monitoring background color changes
    this.startBackgroundMonitoring();
  }

  private startBackgroundMonitoring(): void {
    // Initial check
    this.checkAndUpdateBackgroundColor();

    // Create mutation observer to watch for style changes
    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            (mutation.attributeName === 'style' ||
             mutation.attributeName === 'class')) {
          shouldCheck = true;
        }
        if (mutation.type === 'childList') {
          shouldCheck = true;
        }
      });

      if (shouldCheck) {
        // Debounce the check
        setTimeout(() => this.checkAndUpdateBackgroundColor(), 100);
      }
    });

    // Observe changes to body and html elements
    this.observer.observe(this.document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });

    this.observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  private checkAndUpdateBackgroundColor(): void {
    const bodyStyle = getComputedStyle(this.document.body);
    const htmlStyle = getComputedStyle(this.document.documentElement);

    // Get background color from body or html
    let backgroundColor = bodyStyle.backgroundColor;

    // If body background is transparent, check html
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      backgroundColor = htmlStyle.backgroundColor;
    }

    // If still transparent, use default white
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      backgroundColor = 'rgb(255, 255, 255)';
    }

    // Convert to hex
    const hexColor = this.colorUtils.normalizeColorToHex(backgroundColor);

    // Determine if it's a dark color
    const isDark = this.colorUtils.isColorDark(hexColor);

    // Get appropriate text color
    const textColor = this.colorUtils.getContrastTextColor(hexColor);

    // Update theme if changed
    const currentTheme = this.currentTheme();
    if (currentTheme.backgroundColor !== hexColor) {
      this.currentTheme.set({
        backgroundColor: hexColor,
        textColor: textColor,
        isDark: isDark
      });
    }
  }

  private async initializeMobileFeatures(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await this.setupStatusBar();
      await this.setupEdgeToEdge();
    }
  }

  private async setupStatusBar(): Promise<void> {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.show();
    } catch (error) {
      console.error('Error setting up status bar:', error);
    }
  }

  private async setupEdgeToEdge(): Promise<void> {
    try {
      if (Capacitor.getPlatform() === 'android') {
        await EdgeToEdge.enable();
        await EdgeToEdge.setBackgroundColor({ color: '#ffffff' });
      }
    } catch (error) {
      console.error('Error setting up edge-to-edge:', error);
    }
  }

  private async updateStatusBarForTheme(theme: ThemeConfig): Promise<void> {
    try {
      // Get the optimal status bar configuration for visibility
      const statusBarConfig = this.getOptimalStatusBarConfig(theme.backgroundColor);

      // Update status bar background color
      await this.updateStatusBarColor(statusBarConfig.backgroundColor);

      // Set appropriate text style
      await this.updateStatusBarStyle(statusBarConfig.textStyle);

      console.log(`Status bar updated: ${statusBarConfig.backgroundColor}, style: ${statusBarConfig.textStyle}`);
    } catch (error) {
      console.error('Error updating status bar theme:', error);
    }
  }

  private async updateStatusBarStyle(style: Style): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.error('Error updating status bar style:', error);
      }
    }
  }

  private async updateStatusBarColor(color: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setBackgroundColor({ color });

        if (Capacitor.getPlatform() === 'android') {
          await EdgeToEdge.setBackgroundColor({ color });
        }
      } catch (error) {
        console.error('Error updating status bar color:', error);
      }
    }
  }

  private getOptimalStatusBarConfig(backgroundColor: string): { backgroundColor: string; textStyle: Style } {
    const normalizedColor = backgroundColor.toLowerCase();

    // Handle pure white backgrounds
    if (normalizedColor === '#ffffff' || normalizedColor === 'white') {
      return {
        backgroundColor: '#000000', // Black status bar
        textStyle: Style.Light       // White text
      };
    }

    // Handle pure black backgrounds
    if (normalizedColor === '#000000' || normalizedColor === 'black') {
      return {
        backgroundColor: '#ffffff', // White status bar
        textStyle: Style.Dark       // Black text
      };
    }

    // For all other colors, check if they're dark or light
    const isDark = this.colorUtils.isColorDark(backgroundColor);

    if (isDark) {
      // Dark background → White status bar + Black text
      return {
        backgroundColor: '#ffffff',
        textStyle: Style.Dark
      };
    } else {
      // Light background → Black status bar + White text
      return {
        backgroundColor: '#000000',
        textStyle: Style.Light
      };
    }
  }

  private isVeryLightColor(hex: string): boolean {
    const rgb = this.colorUtils.hexToRgb(hex);
    if (!rgb) return false;

    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.85; // Very light threshold
  }

  private isVeryDarkColor(hex: string): boolean {
    const rgb = this.colorUtils.hexToRgb(hex);
    if (!rgb) return false;

    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.15; // Very dark threshold
  }


  // Public methods for manual theme control
  public async setBackgroundColor(color: string): Promise<void> {
    // Apply to body
    this.document.body.style.backgroundColor = color;

    // Force an immediate check
    setTimeout(() => this.checkAndUpdateBackgroundColor(), 50);
  }

  public async setTheme(backgroundColor: string, textColor?: string): Promise<void> {
    const isDark = this.colorUtils.isColorDark(backgroundColor);
    const finalTextColor = textColor || this.colorUtils.getContrastTextColor(backgroundColor);

    // Apply colors
    this.document.body.style.backgroundColor = backgroundColor;
    this.document.body.style.color = finalTextColor;

    // Update theme state
    this.currentTheme.set({
      backgroundColor,
      textColor: finalTextColor,
      isDark
    });
  }

  public async resetTheme(): Promise<void> {
    // Remove inline styles
    this.document.body.style.backgroundColor = '';
    this.document.body.style.color = '';

    // Force recheck
    setTimeout(() => this.checkAndUpdateBackgroundColor(), 50);
  }

  public getCurrentTheme(): ThemeConfig {
    return this.currentTheme();
  }

  // Public methods for external status bar control
  public async hideStatusBar(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.hide();
      } catch (error) {
        console.error('Error hiding status bar:', error);
      }
    }
  }

  public async showStatusBar(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.show();
      } catch (error) {
        console.error('Error showing status bar:', error);
      }
    }
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.mediaQuery.removeEventListener('change', () => {});
  }
}