# Design Guidelines: 3D Museum Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from https://tszshanmuseum.org/en/ - a dark, sophisticated museum platform with elegant minimalism. The design prioritizes museum-quality aesthetics with careful attention to content presentation and hierarchy.

## Core Design Principles
1. **Dark Sophistication**: Deep, rich backgrounds that make artifacts the focal point
2. **Generous Whitespace**: Breathing room between sections to create gallery-like spaciousness
3. **Subtle Elegance**: Refined transitions and micro-interactions without distraction
4. **Content-First Hierarchy**: Artifacts and their stories take center stage

---

## Typography System

**Headings (Serif)**
- Hero/H1: 3xl-5xl (48-60px desktop) - Refined serif like Playfair Display or Cormorant
- H2: 2xl-3xl (32-40px) - Section headings
- H3: xl-2xl (24-32px) - Subsections
- H4: lg-xl (18-24px) - Card titles

**Body Text (Sans-serif)**
- Primary: base-lg (16-18px) - Clean sans like Inter or Source Sans Pro
- Secondary: sm-base (14-16px) - Metadata, captions
- Small: xs-sm (12-14px) - Labels, timestamps

**Font Weights**: 300 (light), 400 (regular), 600 (semibold), 700 (bold)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 consistently
- Micro spacing (2-4): Between related elements
- Standard spacing (8-12): Between components
- Section spacing (16-24): Between major sections (py-16 to py-24)
- Hero spacing (32): For dramatic hero sections (py-32)

**Container Widths**:
- max-w-7xl: Main content container
- max-w-4xl: Text-heavy content, forms
- max-w-prose: Long-form descriptions

**Grid Layouts**:
- Desktop: 3-4 columns for artifact cards
- Tablet: 2 columns
- Mobile: Single column with full-width cards

---

## Component Library

### Navigation
- Fixed header with transparent-to-solid transition on scroll
- Logo left, navigation center/right
- Minimal navigation links (4-6 max)
- Search icon in header that expands to full-width search bar
- Mobile: Hamburger menu with full-screen overlay navigation

### Hero Section (Homepage)
- Full viewport height (90vh-100vh) with large museum image
- Centered content with translucent backdrop blur for text readability
- Large serif headline with elegant tagline below
- Two CTAs: primary "Explore Collection" and secondary "Virtual Tour"
- Subtle scroll indicator at bottom

### Artifact Cards
- Aspect ratio 4:3 or 1:1 for images
- Hover effect: subtle lift (translate-y-1) and shadow increase
- Card structure: Image → Title (serif) → Short description → Category badge
- 3D icon indicator (small badge) if model available
- Minimal borders or subtle shadow for card definition

### Artifact Detail Page
**Layout**: Two-column desktop (image/3D left, content right), stacked mobile
- Large primary image with thumbnail gallery below (4-6 thumbnails)
- 3D viewer in dedicated section with prominent controls overlay
- Metadata presented in elegant key-value pairs with dividers
- Expandable sections for long descriptions with smooth transitions
- Related artifacts in 3-column grid at bottom

### 3D Viewer Controls
- Floating control panel (semi-transparent backdrop) in bottom-right corner
- Icon buttons for: rotate, zoom reset, auto-rotate toggle, fullscreen
- Minimal design with clear iconography
- Loading state: elegant spinner with "Loading 3D model..." text

### Search & Filter Sidebar
- Fixed sidebar on desktop (300px width), collapsible on mobile
- Search input at top with real-time suggestions dropdown
- Filter groups with clear section headers
- Checkbox filters with counts in parentheses
- Range sliders for date/period with elegant thumb design
- Active filter chips with remove icons above results

### Forms (Admin & Auth)
- Single-column layout (max-w-md centered)
- Input fields with floating labels or top-aligned labels
- Sufficient input height (h-12) for touch-friendly interaction
- Subtle focus states with ring effect
- Error messages below inputs in small text
- Primary button: Full-width on mobile, auto-width desktop

### Admin Dashboard
- Card-based layout for statistics (4 cards in row on desktop)
- Each stat card: Large number, small label, optional trend indicator
- Charts with minimal styling - line/bar charts in muted accent color
- Tables with alternating row backgrounds for readability
- Action buttons: Icon + text combinations

### Comments Section
- Clean list with user avatar placeholder circles
- Comment cards with subtle background differentiation
- Timestamp in small muted text
- Reply/moderate actions aligned right
- Login prompt: Centered message with CTA if not authenticated

---

## Visual Treatment

**Shadows**: Subtle elevation (shadow-sm to shadow-lg), never harsh
**Borders**: Minimal use, prefer subtle shadows or background contrast
**Transitions**: 150-300ms easing for all interactions
**Border Radius**: Consistent medium rounding (rounded-lg) for cards, slight rounding (rounded-md) for inputs

---

## Images

### Hero Section
Large, high-quality museum interior or featured artifact photograph. Should convey sophistication and cultural richness. Dimensions: 1920x1080 minimum, hero-optimized.

### Featured Artifacts (Homepage)
3-6 high-resolution artifact images in carousel/grid. Each image should be professionally photographed with neutral background. Aspect ratio: 4:3.

### Category Images
Representative images for each category (Bronze, Ceramics, Textiles, etc.). Clean, centered product photography style.

### Artifact Detail Images
Multiple angles of each artifact - primary large image plus 4-6 additional views in thumbnail gallery. Professional photography with consistent lighting.

### Admin Placeholders
Use placeholder icons/images for empty states (no artifacts, no comments, etc.)

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2-column grids, condensed spacing)
- Desktop: > 1024px (full layouts, multi-column grids)

**Mobile Optimizations**:
- Touch-friendly tap targets (min 44px height)
- Collapsible filters (drawer from bottom or side)
- Simplified navigation (hamburger menu)
- 3D viewer with swipe gestures for rotation
- Reduced animation/motion on mobile for performance