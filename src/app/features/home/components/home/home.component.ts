import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../../../services/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { BottomNavigationComponent, NavigationItem } from '../../../../shared/components/bottom-navigation/bottom-navigation.component';
import { BubbleBackgroundComponent } from '../../../../shared/components/bubble-background/bubble-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BottomNavigationComponent, BubbleBackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  // Header configuration
  userLocation = 'Downtown, City Center';
  userName = this.getCurrentUser()?.mobileNumber || 'User';
  notificationCount = 3;

  // Bottom Navigation configuration
  activeNavItem = 'home';
  navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home_outlined',
      iconFilled: 'home',
      route: '/home',
      isActive: true
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
      iconFilled: 'person'
    }
  ];

  getCurrentUser() {
    return this.authService.currentUser();
  }

  onLogout() {
    this.authService.logout();
    // Navigate to welcome screen
    this.router.navigate(['/welcome']);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  // Header event handlers
  onLocationSelect(location: string) {
    console.log('Location selected:', location);
    // Implement location selection logic
  }

  onSearchQuery(query: string) {
    console.log('Search query:', query);
    // Implement search logic
  }

  onProfileClick() {
    console.log('Profile clicked');
    // Navigate to profile page or open profile modal
  }

  onNotificationClick() {
    console.log('Notifications clicked');
    // Navigate to notifications page or open notifications panel
  }

  // Bottom Navigation event handlers
  onNavigationItemClick(item: NavigationItem) {
    console.log('Navigation item clicked:', item);
    this.activeNavItem = item.id;

    // Handle specific navigation logic
    switch (item.id) {
      case 'search':
        // Focus search in header or navigate to search page
        break;
      case 'orders':
        // Navigate to orders page
        break;
      case 'favorites':
        // Navigate to favorites page
        break;
      case 'profile':
        // Navigate to profile page or trigger profile click from header
        this.onProfileClick();
        break;
    }
  }

  onActiveNavItemChange(itemId: string) {
    this.activeNavItem = itemId;
  }

}