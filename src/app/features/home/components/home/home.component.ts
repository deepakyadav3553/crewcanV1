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

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  description?: string;
  route?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, HeaderComponent, BottomNavigationComponent, BubbleBackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  // Header configuration
  userLocation = 'Downtown, City Center';
  userName = this.getCurrentUser()?.mobileNumber || 'User';
  notificationCount = 3;

  ngOnInit() {
    this.languageService.initializeLanguage();
    this.updateServiceCategories();
  }

  // Service categories
  serviceCategories: ServiceCategory[] = [
    {
      id: 'cook',
      title: 'Hire Professional Cook',
      icon: 'restaurant',
      description: 'Find experienced cooks for your home',
      route: '/services/cook'
    },
    {
      id: 'contacts',
      title: 'Viewed Contacts',
      icon: 'contacts',
      description: 'Your recently viewed contacts',
      route: '/contacts/viewed'
    },
    {
      id: 'verify',
      title: 'Verify My Worker',
      icon: 'verified_user',
      description: 'Verify worker credentials',
      route: '/verify-worker'
    },
    {
      id: 'electrician',
      title: 'Electrician',
      icon: 'electrical_services',
      description: 'Professional electrical services',
      route: '/services/electrician'
    },
    {
      id: 'plumber',
      title: 'Plumber',
      icon: 'plumbing',
      description: 'Expert plumbing solutions',
      route: '/services/plumber'
    },
    {
      id: 'cleaner',
      title: 'House Cleaning',
      icon: 'cleaning_services',
      description: 'Professional cleaning services',
      route: '/services/cleaner'
    },
    {
      id: 'mechanic',
      title: 'Mechanic',
      icon: 'build',
      description: 'Vehicle repair services',
      route: '/services/mechanic'
    },
    {
      id: 'gardener',
      title: 'Gardener',
      icon: 'grass',
      description: 'Garden maintenance services',
      route: '/services/gardener'
    }
  ];

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
  onLocationSelect(location: LocationOption) {
    console.log('Location selected:', location);
    this.userLocation = this.languageService.getLocationName(location);
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

  onLanguageChange(language: Language) {
    console.log('Language changed:', language);
    this.updateServiceCategories();
    // Update all text content based on new language
  }

  updateServiceCategories() {
    this.serviceCategories = [
      {
        id: 'cook',
        title: this.languageService.translate('services.cook'),
        icon: 'restaurant',
        description: 'Find experienced cooks for your home',
        route: '/services/cook'
      },
      {
        id: 'contacts',
        title: this.languageService.translate('services.contacts'),
        icon: 'contacts',
        description: 'Your recently viewed contacts',
        route: '/contacts/viewed'
      },
      {
        id: 'verify',
        title: this.languageService.translate('services.verify'),
        icon: 'verified_user',
        description: 'Verify worker credentials',
        route: '/verify-worker'
      },
      {
        id: 'electrician',
        title: this.languageService.translate('services.electrician'),
        icon: 'electrical_services',
        description: 'Professional electrical services',
        route: '/services/electrician'
      },
      {
        id: 'plumber',
        title: this.languageService.translate('services.plumber'),
        icon: 'plumbing',
        description: 'Expert plumbing solutions',
        route: '/services/plumber'
      },
      {
        id: 'cleaner',
        title: this.languageService.translate('services.cleaner'),
        icon: 'cleaning_services',
        description: 'Professional cleaning services',
        route: '/services/cleaner'
      },
      {
        id: 'mechanic',
        title: this.languageService.translate('services.mechanic'),
        icon: 'build',
        description: 'Vehicle repair services',
        route: '/services/mechanic'
      },
      {
        id: 'gardener',
        title: this.languageService.translate('services.gardener'),
        icon: 'grass',
        description: 'Garden maintenance services',
        route: '/services/gardener'
      }
    ];
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

  // Service category handlers
  onServiceCategoryClick(service: ServiceCategory) {
    console.log('Service clicked:', service);
    if (service.route) {
      this.router.navigate([service.route]);
    }
  }

  onJobSearchClick() {
    console.log('Job search clicked');
    // Navigate to job search page
    this.router.navigate(['/jobs/search']);
  }

  onPartnerClick() {
    console.log('Partner with us clicked');
    // Navigate to partner registration page
    this.router.navigate(['/partner/register']);
  }

}