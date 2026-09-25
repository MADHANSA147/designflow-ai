---
name: Obsidian Synth
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#007733'
  on-tertiary-container: '#84ff9c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-2:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  caption-medium:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system defines a high-precision, multimodal AI workspace optimized for mobile product designers, creative directors, and systems architects. The aesthetic reflects an elite instrument: deep, focused, and quiet, accented by hyper-saturated bioluminescent bursts that indicate generative computation and active intelligence.

The visual style synthesizes modern technical minimalism with refined glassmorphism and subtle atmospheric glows. Backgrounds remain anchored in pure carbon tones to reduce ocular fatigue during deep design work and maximize the perception of dynamic range in generative canvases. Visual density is balanced strictly for thumb-driven mobile ergonomics without sacrificing the information-dense utility expected of a professional desktop-grade suite.

## Colors

The system operates strictly dark-first. Surface progression relies on micro-stepped neutral values rather than heavy contrast shifts:

- **Canvas Base (`#09090B`)**: Deep neutral black backing the primary viewport and canvas workspace.
- **Surface Level 1 (`#111113`)**: Panels, bottom sheets, navigation bars, and grouping containers.
- **Surface Level 2 (`#18181B`)**: Elevated cards, selectable nodes, tool trays, and modal dialogs.
- **Surface Stroke (`#27272A`)**: Structural borders with 1px hairline rendering to demarcate actionable boundaries without visual clutter.
- **Surface Stroke Active (`#3F3F46`)**: Focused or hovered perimeter state.

### Functional & Semantic Accents
- **Primary Violet (`#7C3AED`)**: Core generative actions, AI processing states, multimodal trigger buttons, and system highlights.
- **Secondary Blue (`#3B82F6`)**: Informational telemetry, selection bounding boxes, and active connection vectors.
- **Success Emerald (`#22C55E`)**: Asset generation confirmation, system health, and synced design tokens.
- **Warning Amber (`#F59E0B`)**: High token consumption, generation warnings, and contrast-check discrepancies.
- **Error Rose (`#EF4444`)**: Synthesis failures, destructive operations, and syntax conflicts.

### Luminescence Rules
AI generative moments use radial gradients falling off from `rgba(124, 58, 237, 0.25)` to `transparent` across a 48px blur radius. Glowing accents must remain under 30% alpha to preserve structural contrast and avoid visual fatigue.

## Typography

The type system is powered by Inter, delivering geometric precision, optical neutrality, and legible forms at micro sizes. For inspector readouts, token hex values, and node coordinates, JetBrains Mono is deployed to support rapid numerical scanning.

### Hierarchy & Mobile Application
- **Display (32px)**: Reserved for onboarding headlines, milestone summary dashboards, and system modal anchors.
- **Headline 1 (24px)**: View headers, top-level project titles, and generative gallery headings.
- **Headline 2 (18px)**: Sheet sections, card headers, and panel group dividers.
- **Body (14px)**: Primary conversational prompt interface, assistant messaging, and attribute lists.
- **Caption (12px)**: Metadata indicators, secondary parameters, token classifications, and timestamps.
- **Label-Code (11px)**: Vector nodes, CSS attributes, hex chips, and coordinate meters.

## Layout & Spacing

Layout adheres to an uncompromising 4px spatial rhythm. Mobile viewports target standard 390x844 dimensions with dynamic safe-area insets. 

- **Outer Canvas Margins**: 16px (`1rem`) on horizontal edges to ensure structural consistency while maximizing content utility on narrow displays.
- **Grid Structure**: 4-column fluid mobile grid with 12px (`0.75rem`) gutters for multi-card asset feeds, property matrices, and template shelves.
- **Component Padding Scale**:
  - `space-xs` (4px): Icon-to-text gaps within micro badges, tag interior vertical padding.
  - `space-sm` (8px): Button internal vertical padding, segmented control gaps, list item internal padding.
  - `space-md` (12px): Standard card interior padding, input field padding, prompt bubble spacing.
  - `space-lg` (16px): Bottom sheet internal gutters, workspace canvas element margins.
  - `space-xl` (24px): Inter-section spacing, terminal action row clearances.
- **Thumb Zone Optimization**: Primary tool selectors, multimodal voice/text inputs, and transform pivots are docked to a sticky bottom-rail zone within a 44px to 80px reach envelope from the bottom navigation boundary.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows, which muddy dark interfaces. Depth is achieved via tonal surface layering, translucent backdrop blurs, and hairline perimeter illumination.

### Tonal Hierarchy
- **Level 0 (Workspace Canvas)**: Solid `#09090B`. Recessed beneath all interactive panels.
- **Level 1 (Docked Shelves & Rails)**: Background `#111113` with `1px solid #27272A`.
- **Level 2 (Active Cards & Tooling Overlays)**: Background `#18181B` with `1px solid #27272A`.
- **Level 3 (Popovers, Tooltips & Context Menus)**: Background `rgba(24, 24, 27, 0.85)` with 16px background blur, stroke `rgba(255, 255, 255, 0.12)`, and ambient shadow `0 12px 32px -4px rgba(0, 0, 0, 0.6)`.

### Glass & Lighting
- **Frosted Surfaces**: Bottom navigation and floating toolbars use `backdrop-filter: blur(20px)` over `rgba(17, 17, 19, 0.75)`.
- **AI Generative Glow**: Active generative items feature a dynamic perimeter aura: a box shadow composed of `0 0 0 1px #7C3AED, 0 0 20px -2px rgba(124, 58, 237, 0.35)`.

## Shapes

The design system applies a disciplined roundedness scale (Level 2) that marries technical sharpness with tactile ergonomics:

- **Base Radius (8px / `0.5rem`)**: Applied to input controls, icon action buttons, chips, nested list items, and code blocks.
- **Large Radius (16px / `1rem`)**: Applied to cards, canvas artboard containers, floating prompt bars, and dialogs.
- **Extra Large Radius (24px / `1.5rem`)**: Applied to modal bottom sheets, contextual slide-over inspectors, and swipe drawers.
- **Fully Rounded / Pill (`9999px`)**: Reserved for status tags, generation chips, active microphone recording pills, and user avatar anchors.

## Components

### Buttons & Triggers
- **Primary AI Action**: Electric violet background (`#7C3AED`), white text (`#FFFFFF`), `font-weight: 600`, height 44px, radius 8px. Hover/active shifts to `#6D28D9` with a subtle violet perimeter halo.
- **Secondary Workspace Action**: `#18181B` surface with 1px `#27272A` border and `#F4F4F5` label. Active state triggers a background shift to `#27272A`.
- **Ghost Tool Buttons**: Transparent background, `#A1A1AA` icons/text, sizing strictly 40x40px to honor minimum mobile touch targets.

### Input Fields & Multimodal Prompt Dock
- **Floating Generative Bar**: Anchored above the safe area. 16px corner radius, `rgba(24, 24, 27, 0.9)` fill with `backdrop-filter: blur(16px)` and a 1px border (`#27272A`). Contains an embedded voice transcription waveform, upload pill, prompt input, and violet send trigger.
- **Standard Text Fields**: `#111113` surface, `#27272A` border, 12px horizontal padding, 40px height. Focus transitions the border to `#7C3AED` with an internal soft glow.

### Cards & Inspectors
- **Design Node Cards**: `#18181B` surface, 1px `#27272A` border, 16px padding. Multi-state selected cards replace the `#27272A` border with `#3B82F6` and add 4 corner coordinate grab handles.
- **Component Preview Canvas**: Recessed `#09090B` inset with an optional 16px dot matrix grid at 8% opacity.

### Chips, Tags & Status Badges
- **Model/Token Pills**: Height 24px, 9999px radius, `#18181B` fill, `#27272A` stroke. Font is 11px JetBrains Mono with 4px inner spacing.
- **Processing Status**: Emerald (`#22C55E`), amber (`#F59E0B`), or rose (`#EF4444`) 6px circular dot indicator with a pulsing opacity animation nested next to 12px medium labels.

### Selection Controls
- **Checkboxes & Radios**: 18px dimensions, 4px radius for checkboxes, full circle for radios. Unchecked state uses `#18181B` background and `#27272A` border; checked state fills with `#7C3AED` and displays a crisp white check or center pip.
- **Segmented Control Switchers**: `#111113` channel track with 4px internal padding; selected segment lifts with `#18181B` fill, 1px `#27272A` stroke, and text color moving from `#71717A` to `#FAFAFA`.