import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../../../services/theme.service';
import { LanguageService, Language, LocationOption } from '../../../../services/language.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { BottomNavigationComponent, NavigationItem } from '../../../../shared/components/bottom-navigation/bottom-navigation.component';
import { BubbleBackgroundComponent } from '../../../../shared/components/bubble-background/bubble-background.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    BottomNavigationComponent,
    BubbleBackgroundComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  // Header configuration
  userLocation = 'Downtown, City Center';
  userName = this.getCurrentUser()?.mobileNumber || 'User';
  notificationCount = 3;

  // Bottom Navigation configuration
  activeNavItem = 'profile';
  navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home_outlined',
      iconFilled: 'home',
      route: '/home'
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'search',
      iconFilled: 'search'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'receipt_long',
      iconFilled: 'receipt_long',
      badge: 2
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'favorite_border',
      iconFilled: 'favorite'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person_outline',
      iconFilled: 'person',
      route: '/profile',
      isActive: true
    }
  ];

  ngOnInit() {
    this.languageService.initializeLanguage();
  }

  getCurrentUser() {
    return this.authService.currentUser();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  // Header event handlers
  onLocationSelect(location: LocationOption) {
    console.log('Location selected:', location);
    this.userLocation = this.languageService.getLocationName(location);
  }

  onSearchQuery(query: string) {
    console.log('Search query:', query);
  }

  onProfileClick() {
    console.log('Profile clicked');
  }

  onNotificationClick() {
    console.log('Notifications clicked');
  }

  onLanguageChange(language: Language) {
    console.log('Language changed:', language);
  }

  // Bottom Navigation event handlers
  onNavigationItemClick(item: NavigationItem) {
    console.log('Navigation item clicked:', item);
    this.activeNavItem = item.id;
  }

  onActiveNavItemChange(itemId: string) {
    this.activeNavItem = itemId;
  }
}