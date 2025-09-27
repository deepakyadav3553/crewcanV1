import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  iconFilled?: string;
  route?: string;
  badge?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent {
  @Input() items: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      iconFilled: 'home',
      route: '/home',
      isActive: true
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: 'explore',
      iconFilled: 'explore'
    },
    {
      id: 'create',
      label: 'Create',
      icon: 'add_circle_outline',
      iconFilled: 'add_circle'
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: 'notifications_none',
      iconFilled: 'notifications',
      badge: 3
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person_outline',
      iconFilled: 'person'
    }
  ];

  @Input() activeItemId = 'home';
  @Output() itemClick = new EventEmitter<NavigationItem>();
  @Output() activeItemChange = new EventEmitter<string>();

  private router = inject(Router);

  onItemClick(item: NavigationItem) {
    // Update active state
    this.items.forEach(navItem => navItem.isActive = navItem.id === item.id);
    this.activeItemId = item.id;

    // Emit events
    this.itemClick.emit(item);
    this.activeItemChange.emit(item.id);

    // Navigate if route is provided
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  isItemActive(item: NavigationItem): boolean {
    return item.id === this.activeItemId || item.isActive === true;
  }

  getIcon(item: NavigationItem): string {
    return this.isItemActive(item) && item.iconFilled ? item.iconFilled : item.icon;
  }
}