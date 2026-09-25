# Frontend Architecture Audit

> Updated 2026-09-25: the original findings below describe the initial mockups, not the current app. The active implementation is now `src/app/`, packaged for Android under `android/`. See [the project README](../README.md) for setup, tested features, and remaining scope.

## Current implementation

- TypeScript + Vite + Capacitor Android; responsive charcoal/violet UI based on the original design direction.
- Persistent local projects, editable briefs, shared design tokens, structured component schemas, screen navigation, design checks, version restoration, and exports.
- Real optional Node/SQLite account and backup service under `server/`. Server-side Gemini text/vision generation and refinement adapter with schema validation. No API keys are shipped to the app.
- Template mode is explicitly labeled; no fake AI score, fake synchronization, or fabricated export completion.
- Unit/API tests and mobile/desktop browser workflow tests. Android debug APK build workflow included.
- Original `src/pages/`, `src/services/`, `src/types/`, and `backend/` are preserved historical scaffolds; they are not loaded by the active app.

## Original audit (historical)

## 1. Current Stack
- **Framework:** None (Vanilla HTML)
- **Build Tool:** None (Raw HTML files currently)
- **Language:** HTML / JavaScript
- **CSS/Styling System:** Tailwind CSS (via CDN)
- **Component Library:** None (Custom HTML/Tailwind)
- **Router:** None (File-based HTML navigation needed)
- **State Management:** None
- **Dependencies:** None
- **Mock Data:** Hardcoded in HTML
- **Architecture:** Flat folder structure with `code.html` and `screen.png` per screen.

## 2. Folder Structure (Current)
```
/
├── ai_ux_review/
├── create_project/
├── design_studio/
├── design_system/
├── designflow_ai_logo/
├── developer_mode/
├── home_dashboard/
├── modern_tech_professional_headshot.../
├── obsidian_synth/
├── product_understanding/
└── ux_planner/
```

## 3. Existing Screens Mapping
- **Home Dashboard:** `home_dashboard/code.html`
- **Create Project:** `create_project/code.html`
- **UX Planner:** `ux_planner/code.html`
- **Product Understanding:** `product_understanding/code.html`
- **Design System:** `design_system/code.html`
- **Design Studio:** `design_studio/code.html`
- **AI UX Review:** `ai_ux_review/code.html`
- **Developer Mode:** `developer_mode/code.html`
- (Other assets: `designflow_ai_logo`, `obsidian_synth`, etc.)

## 4. Existing Functionality
- **Implemented:** Static visual layouts, responsive styling, dark mode configuration (Tailwind), embedded Google Fonts/Icons.
- **Missing Functionality:** Interactive routing, component reusability, build process, state management, API integration, interactive JavaScript functionality.

## 5. Backend Integration Points
- **Auth:** Login/Signup needed.
- **Projects:** Fetching/saving project lists, active project data.
- **UX/Product:** Sending idea/brief to AI, retrieving generated UX plans.
- **Design Studio:** Syncing canvas state, design tokens, generated components.
- **Review:** Triggering AI review, fetching accessibility/UX scores.

## 6. Recommended Architecture (Vanilla TS + Vite)
To maintain the visual source of truth without redesigning, the project should be upgraded to a Vite project with TypeScript support for services/types, keeping the raw HTML/CSS intact.
- `src/pages/` - Existing HTML screens
- `src/types/` - UI Data Models
- `src/services/` - API Mock Services
- `src/assets/` - Image and logo assets
