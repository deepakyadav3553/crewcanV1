import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showLocationPicker = true;
  @Input() showSearch = true;
  @Input() showProfile = true;
  @Input() userLocation = 'Select Location';
  @Input() userName = 'John Doe';
  @Input() userAvatar = '';
  @Input() notificationCount = 0;

  @Output() locationSelect = new EventEmitter<string>();
  @Output() searchQuery = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();

  searchText = signal('');
  isSearchFocused = signal(false);

  onLocationClick() {
    // Emit event for parent to handle location selection
    this.locationSelect.emit(this.userLocation);
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchText.set(query);
    this.searchQuery.emit(query);
  }

  onSearchFocus() {
    this.isSearchFocused.set(true);
  }

  onSearchBlur() {
    this.isSearchFocused.set(false);
  }

  onProfileClick() {
    this.profileClick.emit();
  }

  onNotificationClick() {
    this.notificationClick.emit();
  }


  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}