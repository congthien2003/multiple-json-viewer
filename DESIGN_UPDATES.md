# Design & Animation Updates

## Overview
JSON Viewer đã được nâng cấp với design SaaS sang trọng, typography elegante, và smooth animations để tạo trải nghiệm chuyên nghiệp.

## Typography Changes

### Fonts
- **Body Text**: Inter (Modern, clean, professional)
- **Headings**: Playfair Display (Elegant, premium feel)
- **Code**: Geist Mono (Monospace for JSON content)

### Implementation
Fonts được cấu hình trong `layout.tsx` với CSS variables:
```tsx
const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-heading' });
```

## Color & Gradient Updates

### Background Gradients
- **Light Mode**: Gradient nhẹ từ blue-50 to white (135deg)
- **Dark Mode**: Gradient nhẹ từ slate-950 to slate-900 with blue tint (135deg)

```css
:root {
  --background: linear-gradient(135deg, oklch(0.98 0.01 240) 0%, oklch(1 0 0) 100%);
}

.dark {
  --background: linear-gradient(135deg, oklch(0.12 0.02 260) 0%, oklch(0.145 0 0) 100%);
}
```

### Accent Colors
- Primary gradient: Blue → Purple (Blue-500 to Purple-600)
- Hover states: Subtle background tints (Blue-50/Blue-950)
- Transitions: 300ms ease for smooth interactions

## Animation System

### Keyframe Animations
Được định nghĩa trong `globals.css`:

1. **fadeIn** (0.3s)
   - Opacity: 0 → 1
   - Dùng cho: Content loading, display sections

2. **slideUp** (0.4s)
   - Transform: translateY(10px) → translateY(0)
   - Opacity: 0 → 1
   - Dùng cho: Active tabs, tab items

3. **slideDown** (0.4s)
   - Transform: translateY(-10px) → translateY(0)
   - Opacity: 0 → 1
   - Dùng cho: Header, dropdowns

4. **scaleIn** (0.3s)
   - Scale: 0.95 → 1
   - Opacity: 0 → 1
   - Dùng cho: Dialog content, modals

## Component Updates

### Header
- **Gradient Logo**: Blue-500 to Purple-600 background
- **Gradient Title**: Text gradient effect
- **Backdrop Blur**: Frosted glass effect
- **Animation**: `slideDown` entry animation
- **Shadow**: Subtle shadow for depth

```tsx
<header className="...backdrop-blur-sm...animate-slideDown shadow-sm">
```

### Buttons
- **New Tab Button**: Gradient background (Blue → Purple)
- **Hover**: Scale 1.05 + shadow increase
- **Transition**: 300ms cubic-bezier for bouncy feel

```tsx
className="bg-gradient-to-r from-blue-500 to-purple-500 
           hover:shadow-lg hover:scale-105 transition-all duration-300"
```

### Tabs
- **Active Tab**: Slide up animation, white background, blue border
- **Hover**: Border color change to blue, smooth transition
- **Inactive**: Muted background, hover to foreground color

```tsx
className={`...animate-slideUp... ${isActive ? 'animate-slideUp' : ''}`}
```

### Form Controls
- **Theme Selector**: Hover border color transition to blue
- **Editor Buttons**: Hover background tint + transition

```tsx
className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
```

### Display & Preview
- **Copy Button**: Hover state with background tint
- **Animation**: `fadeIn` for preview content
- **Icon**: Animate palette icon on load

### Empty State
- **Icon**: Gradient background, hover scale effect
- **Title**: Gradient text effect
- **Container**: `fadeIn` animation

## Easing Functions
- **Smooth easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy feel)
- **Linear fade**: `ease-in-out` (0.3s)
- **Standard transition**: `duration-300`

## Best Practices Applied

1. **Subtle Gradients**: Nhẹ nhàng, không quá nổi
2. **Smooth Transitions**: Mọi state change có animation
3. **Hover Feedback**: Visual feedback ngay lập tức
4. **Backdrop Effects**: Frosted glass effect cho modern feel
5. **Layered Shadows**: Tạo depth without being overdone
6. **Color Consistency**: Gradient primary colors (Blue → Purple) throughout
7. **Performance**: CSS animations (not JS) for 60fps

## Browser Support
- Modern browsers supporting:
  - CSS Gradients ✓
  - CSS Animations ✓
  - Backdrop filters ✓
  - CSS Grid/Flexbox ✓

## Responsive Design
- Mobile-first approach
- Animations maintain smoothness on all devices
- Touch-friendly button sizes (min 44px)
- Gradient backgrounds scale perfectly

---

All changes maintain backwards compatibility while providing a premium, modern SaaS aesthetic.
