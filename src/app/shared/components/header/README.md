# Mobile-First Header Component

A modern, mobile-optimized header component for the CrewCan application featuring location selection, search functionality, and profile management.

## Features

- **📱 Mobile-First Design**: Optimized specifically for mobile devices with touch-friendly interactions
- **📍 Location Picker**: Shows current delivery location with "Tap to change" indication
- **🔍 Search Bar**: Full-width search on separate row for better mobile UX
- **👤 Profile Menu**: Simplified avatar button with enhanced mobile menu
- **🔔 Notifications**: Bell icon with notification badge
- **🎯 Touch Optimized**: 48px minimum touch targets, proper spacing, and visual feedback
- **🌙 Theme Support**: Supports both light and dark themes using CSS custom properties

## Usage

### Basic Implementation

```typescript
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  // ... other config
  imports: [CommonModule, HeaderComponent],
})
export class YourComponent {
  userLocation = 'Downtown, City Center';
  userName = 'John Doe';
  notificationCount = 3;

  onLocationSelect(location: string) {
    console.log('Location selected:', location);
  }

  onSearchQuery(query: string) {
    console.log('Search query:', query);
  }

  onProfileClick() {
    // Navigate to profile or open profile modal
  }

  onNotificationClick() {
    // Navigate to notifications
  }

  onMenuClick() {
    // Open mobile menu
  }
}
```

### Template Usage

```html
<app-header
  [userLocation]="userLocation"
  [userName]="userName"
  [notificationCount]="notificationCount"
  (locationSelect)="onLocationSelect($event)"
  (searchQuery)="onSearchQuery($event)"
  (profileClick)="onProfileClick()"
  (notificationClick)="onNotificationClick()"
  (menuClick)="onMenuClick()">
</app-header>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showLocationPicker` | boolean | `true` | Show/hide location picker section |
| `showSearch` | boolean | `true` | Show/hide search bar |
| `showProfile` | boolean | `true` | Show/hide profile section |
| `userLocation` | string | `'Select Location'` | Current delivery location text |
| `userName` | string | `'John Doe'` | User display name |
| `userAvatar` | string | `''` | URL to user avatar image |
| `notificationCount` | number | `0` | Number of unread notifications |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `locationSelect` | `EventEmitter<string>` | Fired when location picker is clicked |
| `searchQuery` | `EventEmitter<string>` | Fired when search input changes |
| `profileClick` | `EventEmitter<void>` | Fired when profile is clicked |
| `notificationClick` | `EventEmitter<void>` | Fired when notification bell is clicked |
| `menuClick` | `EventEmitter<void>` | Fired when mobile menu button is clicked |

## Mobile-First Responsive Behavior

### Mobile Layout (Primary Design)
- **Two-Row Layout**: Top row for location/profile, bottom row for search
- **48px Touch Targets**: All interactive elements meet accessibility standards
- **Simplified Profile**: Avatar-only button with enhanced dropdown menu
- **Full-Width Search**: Dedicated row for optimal search experience
- **Touch Feedback**: Visual scale animations on tap/press

### Tablet & Desktop (Enhanced)
- **Larger Touch Targets**: 52px+ for better tablet experience
- **Improved Spacing**: More padding and margins for larger screens
- **Constrained Width**: Maximum widths to prevent stretching on large screens
- **Enhanced Menu**: Richer profile dropdown with better visual hierarchy

### Small Mobile (≤375px)
- **Optimized Spacing**: Reduced padding and gaps
- **Smaller Icons**: 22px icons for compact layout
- **Condensed Text**: Smaller font sizes where appropriate
- **Efficient Layout**: Maximum space utilization

## Theme Integration

The header automatically adapts to your app's theme using CSS custom properties:

- `--card-bg`: Header background
- `--border-color`: Border colors
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-muted`: Muted text color
- `--surface-bg`: Button and input backgrounds
- `--info-color`: Accent color for interactive elements

## Dependencies

The component requires the following Angular Material modules:

- `MatIconModule`
- `MatButtonModule`
- `MatMenuModule`
- `MatBadgeModule`
- `MatDividerModule`

These are automatically imported when using the component.

## Customization

### Custom Avatar

```html
<app-header
  [userAvatar]="'https://example.com/avatar.jpg'"
  [userName]="userName">
</app-header>
```

### Hiding Sections

```html
<app-header
  [showLocationPicker]="false"
  [showSearch]="true"
  [showProfile]="true">
</app-header>
```

### Custom Notification Count

```html
<app-header
  [notificationCount]="unreadCount">
</app-header>
```

## Accessibility

- All interactive elements are keyboard accessible
- Proper ARIA labels for screen readers
- High contrast support in theme colors
- Focus indicators for all interactive elements