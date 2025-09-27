# Bubble Background Component

A reusable Angular component that provides animated background bubbles for enhanced visual appeal.

## Usage

```html
<app-bubble-background
  density="medium"
  color="blue"
  speed="normal">
</app-bubble-background>
```

## Props

### density
Controls the number of bubbles displayed:
- `"light"` - 4 bubbles (minimal)
- `"medium"` - 6 bubbles (default)
- `"heavy"` - 8 bubbles (more visual impact)

### color
Sets the bubble color theme:
- `"blue"` - Blue gradient (default)
- `"purple"` - Purple gradient
- `"green"` - Green gradient

### speed
Controls animation speed:
- `"slow"` - 12s animation duration
- `"normal"` - 8s animation duration (default)
- `"fast"` - 6s animation duration

## Examples

### Welcome Screen (Medium density)
```html
<app-bubble-background density="medium" color="blue" speed="normal"></app-bubble-background>
```

### Login Screen (Light density)
```html
<app-bubble-background density="light" color="blue" speed="normal"></app-bubble-background>
```

### Success Screen (Green theme)
```html
<app-bubble-background density="light" color="green" speed="slow"></app-bubble-background>
```

### Error Screen (Purple theme, heavy)
```html
<app-bubble-background density="heavy" color="purple" speed="fast"></app-bubble-background>
```

## Features

- ✅ Fully responsive design
- ✅ GPU-accelerated animations
- ✅ Non-intrusive (pointer-events: none)
- ✅ Configurable density, color, and speed
- ✅ Optimized for mobile devices
- ✅ Zero JavaScript dependencies (CSS-only animations)

## Technical Details

The component uses:
- CSS transforms for smooth animations
- Absolute positioning with overflow hidden
- z-index: 0 to stay behind content
- Responsive breakpoints for different screen sizes
- Low opacity gradients for subtle visual effect

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support