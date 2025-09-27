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

export type ThemeMode = 'light' | 'dark' | 'auto';

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
  public themeMode = signal<ThemeMode>('auto');

  private observer: MutationObserver | null = null;
  private mediaQuery: MediaQueryList;
  private readonly THEME_KEY = 'crewcan-theme-mode';

  constructor() {
    // Initialize mobile device detection
    this.initializeMobileThemeDetection();

    // Load saved theme mode (only if user explicitly set it)
    this.loadSavedThemeMode();

    // Listen for system dark mode changes
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode.set(this.mediaQuery.matches);

    this.mediaQuery.addEventListener('change', (e) => {
      this.isDarkMode.set(e.matches);
      // If user hasn't explicitly set a theme, follow system preference
      if (this.themeMode() === 'auto') {
        this.updateThemeClass();
      }
    });

    // Initialize theme - prioritize system preference for mobile
    this.initializeThemeBasedOnDevice();

    // Initialize mobile features
    this.initializeMobileFeatures();

    // Effect to update status bar when theme changes
    effect(() => {
      const theme = this.currentTheme();
      this.updateStatusBarForTheme(theme);
    });

    // Effect to apply theme mode changes
    effect(() => {
      this.updateThemeClass();
    });

    // Start monitoring background color changes
    this.startBackgroundMonitoring();

    // Enhanced mobile theme monitoring
    this.setupEnhancedMobileThemeDetection();
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

  // Enhanced mobile theme detection methods
  private initializeMobileThemeDetection(): void {
    // Detect if this is a mobile device
    const isMobile = this.isMobileDevice();

    if (isMobile) {
      console.log('Mobile device detected - will follow system theme preference');
    }
  }

  private initializeThemeBasedOnDevice(): void {
    const isMobile = this.isMobileDevice();
    const systemIsDark = this.isDarkMode();

    // For mobile devices, default to auto mode to follow system
    if (isMobile && !localStorage.getItem(this.THEME_KEY)) {
      this.themeMode.set('auto');
      console.log(`Mobile device theme initialized: Auto (${systemIsDark ? 'Dark' : 'Light'})`);
    }

    this.updateThemeClass();
  }

  private setupEnhancedMobileThemeDetection(): void {
    const isMobile = this.isMobileDevice();

    if (isMobile) {
      // Additional mobile-specific theme detection
      this.setupVisibilityChangeDetection();
      this.setupOrientationChangeDetection();
    }
  }

  private setupVisibilityChangeDetection(): void {
    // When user returns to app (e.g., from settings), recheck theme
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.themeMode() === 'auto') {
        // Small delay to allow system to settle
        setTimeout(() => {
          const newSystemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (newSystemIsDark !== this.isDarkMode()) {
            this.isDarkMode.set(newSystemIsDark);
            this.updateThemeClass();
            console.log(`System theme changed to: ${newSystemIsDark ? 'Dark' : 'Light'}`);
          }
        }, 100);
      }
    });
  }

  private setupOrientationChangeDetection(): void {
    // On orientation change, recheck theme (some devices change theme on rotation)
    window.addEventListener('orientationchange', () => {
      if (this.themeMode() === 'auto') {
        setTimeout(() => {
          const newSystemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (newSystemIsDark !== this.isDarkMode()) {
            this.isDarkMode.set(newSystemIsDark);
            this.updateThemeClass();
            console.log(`Theme updated after orientation change: ${newSystemIsDark ? 'Dark' : 'Light'}`);
          }
        }, 200);
      }
    });
  }

  private isMobileDevice(): boolean {
    // Check for mobile device using multiple methods
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    // Check for touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check screen size (assuming mobile if width <= 768px)
    const isSmallScreen = window.innerWidth <= 768;

    // Check if running in Capacitor (native mobile app)
    const isCapacitor = Capacitor.isNativePlatform();

    return isMobileUserAgent || isCapacitor || (isTouchDevice && isSmallScreen);
  }

  // Theme mode management methods
  private loadSavedThemeMode(): void {
    const saved = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      this.themeMode.set(saved);
    } else {
      // If no saved preference and mobile device, default to auto
      if (this.isMobileDevice()) {
        this.themeMode.set('auto');
      }
    }
  }

  private updateThemeClass(): void {
    const body = this.document.body;
    const mode = this.themeMode();

    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');

    // Determine effective theme
    let effectiveTheme: 'light' | 'dark';
    if (mode === 'auto') {
      effectiveTheme = this.isDarkMode() ? 'dark' : 'light';
    } else {
      effectiveTheme = mode;
    }

    // Apply theme class
    body.classList.add(`theme-${effectiveTheme}`);
  }

  // Public theme control methods
  public setThemeMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
    localStorage.setItem(this.THEME_KEY, mode);
    this.updateThemeClass();
  }

  public toggleTheme(): void {
    const current = this.themeMode();
    if (current === 'light') {
      this.setThemeMode('dark');
    } else if (current === 'dark') {
      this.setThemeMode('light');
    } else {
      // If auto, toggle to opposite of current system preference
      const systemIsDark = this.isDarkMode();
      this.setThemeMode(systemIsDark ? 'light' : 'dark');
    }
  }

  public getEffectiveTheme(): 'light' | 'dark' {
    const mode = this.themeMode();
    if (mode === 'auto') {
      return this.isDarkMode() ? 'dark' : 'light';
    }
    return mode;
  }

  public isCurrentlyDark(): boolean {
    return this.getEffectiveTheme() === 'dark';
  }

  public getThemeIcon(): string {
    const mode = this.themeMode();
    switch (mode) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'auto': return this.isDarkMode() ? '🌙' : '☀️';
      default: return '☀️';
    }
  }

  public getThemeLabel(): string {
    const mode = this.themeMode();
    const isMobile = this.isMobileDevice();
    switch (mode) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'auto': return isMobile
        ? `System (${this.getEffectiveTheme()})`
        : `Auto (${this.getEffectiveTheme()})`;
      default: return 'Auto';
    }
  }

  // Public method to force refresh theme detection (useful for mobile)
  public refreshSystemTheme(): void {
    const newSystemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentSystemIsDark = this.isDarkMode();

    if (newSystemIsDark !== currentSystemIsDark) {
      this.isDarkMode.set(newSystemIsDark);
      if (this.themeMode() === 'auto') {
        this.updateThemeClass();
        console.log(`System theme refreshed: ${newSystemIsDark ? 'Dark' : 'Light'}`);
      }
    }
  }

  // Check if running on mobile device
  public isMobile(): boolean {
    return this.isMobileDevice();
  }

  // Get system theme preference
  public getSystemTheme(): 'light' | 'dark' {
    return this.isDarkMode() ? 'dark' : 'light';
  }

  // Force auto mode (useful for mobile devices)
  public setAutoMode(): void {
    this.setThemeMode('auto');
    console.log(`Theme set to auto mode - following system: ${this.getSystemTheme()}`);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.mediaQuery.removeEventListener('change', () => {});
  }
}