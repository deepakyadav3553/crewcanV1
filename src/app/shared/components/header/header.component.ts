import { Component, Input, Output, EventEmitter, signal, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { LanguageService, Language, LocationOption } from '../../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showLocationPicker = true;
  @Input() showSearch = true;
  @Input() showProfile = true;
  @Input() userLocation = 'Select Location';
  @Input() userName = 'John Doe';
  @Input() userAvatar = '';
  @Input() notificationCount = 0;

  @Output() locationSelect = new EventEmitter<LocationOption>();
  @Output() searchQuery = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() languageChange = new EventEmitter<Language>();

  searchText = signal('');
  isSearchFocused = signal(false);
  showLocationMenu = signal(false);
  showLanguageMenu = signal(false);
  showNotificationMenu = signal(false);
  showProfileMenu = signal(false);

  public languageService = inject(LanguageService);

  ngOnInit() {
    this.languageService.initializeLanguage();
  }

  onLocationClick() {
    this.showLocationMenu.set(!this.showLocationMenu());
    // Close other menus
    this.showLanguageMenu.set(false);
    this.showNotificationMenu.set(false);
    this.showProfileMenu.set(false);
  }

  onLocationSelect(location: LocationOption) {
    this.userLocation = this.languageService.getLocationName(location);
    this.locationSelect.emit(location);
    this.showLocationMenu.set(false);
  }

  onCurrentLocationClick() {
    // Handle current location detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation: LocationOption = {
          id: 'current',
          name: 'Current Location',
          translations: {
            en: 'Current Location',
            hi: 'वर्तमान स्थान',
            kn: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ',
            te: 'ప్రస్తుత స్థానం',
            ta: 'தற்போதைய இடம்'
          },
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };
        this.onLocationSelect(currentLocation);
      });
    }
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchText.set(query);
    this.searchQuery.emit(query);
  }

  onSearchFocus() {
    this.isSearchFocused.set(true);
    this.closeAllDropdowns();
  }

  onSearchBlur() {
    this.isSearchFocused.set(false);
  }

  closeAllDropdowns() {
    this.showLocationMenu.set(false);
    this.showLanguageMenu.set(false);
    this.showNotificationMenu.set(false);
    this.showProfileMenu.set(false);
  }

  clearSearch() {
    this.searchText.set('');
    this.searchQuery.emit('');
  }

  onProfileClick() {
    this.profileClick.emit();
  }

  onNotificationClick() {
    this.notificationClick.emit();
  }

  onLanguageMenuClick() {
    this.showLanguageMenu.set(!this.showLanguageMenu());
    // Close other menus
    this.showLocationMenu.set(false);
    this.showNotificationMenu.set(false);
    this.showProfileMenu.set(false);
  }

  onLanguageSelect(language: Language) {
    this.languageService.setLanguage(language.code);
    this.languageChange.emit(language);
    this.showLanguageMenu.set(false);
  }

  onNotificationMenuClick() {
    this.showNotificationMenu.set(!this.showNotificationMenu());
    // Close other menus
    this.showLocationMenu.set(false);
    this.showLanguageMenu.set(false);
    this.showProfileMenu.set(false);
  }

  onProfileMenuClick() {
    this.showProfileMenu.set(!this.showProfileMenu());
    // Close other menus
    this.showLocationMenu.set(false);
    this.showLanguageMenu.set(false);
    this.showNotificationMenu.set(false);
  }

  getSearchPlaceholder(): string {
    return this.languageService.translate('search.placeholder');
  }

  getLocationLabel(): string {
    return this.languageService.translate('location.select');
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const headerElement = target.closest('.app-header');

    // If click is outside the header, close all dropdowns
    if (!headerElement) {
      this.closeAllDropdowns();
    }
    // If click is inside header but not on a dropdown or button, close dropdowns
    else if (!target.closest('.location-section') &&
             !target.closest('.language-button') &&
             !target.closest('.notification-button') &&
             !target.closest('.profile-button') &&
             !target.closest('.location-menu') &&
             !target.closest('.language-menu') &&
             !target.closest('.notification-menu') &&
             !target.closest('.profile-menu')) {
      this.closeAllDropdowns();
    }
  }
}