# DesignFlow AI

An Android-first, local-first product design app built from the original Obsidian Synth visual direction. The installable Android app uses Capacitor and a TypeScript frontend. The original HTML mockups remain as reference material.

## Start the app

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. No database, account, API key, CDN, or internet connection is required for the local design workflow. Android bundles all frontend assets.

## Android APK

The debug APK is generated at `artifacts/DesignFlow-AI-debug.apk`. Copy it to an Android phone and open it to install. It is a development build, not a Play Store release.

To rebuild on Windows with Android Studio / Android SDK 36 and Java 21 installed:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-android.ps1
```

Alternatively run `npm run android:sync`, open `android/` in Android Studio, and build the APK. The app supports Android 7+ (API 24+), with a current Android System WebView. A signed release/AAB requires your own signing key and store account.

## What works locally

- Project creation from food delivery, fitness, shopping, and general templates; editable product briefs and feature lists.
- Project search, favorites, duplication, deletion, and persistent device storage.
- Structured multi-screen designs with editable headings, body text, cards, buttons, inputs, image placeholders, and navigation.
- Add, reorder, edit, or remove elements; add/delete/rename screens; choose tap destinations.
- Shared color, spacing, text size, and corner-radius tokens; four palette presets.
- Local assistant commands for dark/light/blue/green themes, spacing, minimal/rounded styling, and readability fixes. These are explicitly labeled local commands, not generative AI.
- Interactive screen navigation and preview-only form fields.
- Measured contrast and rule-based checks for body size, headings, labels, and navigation. This is not an accessibility certification.
- Last 20 design snapshots with restore.
- Standalone interactive HTML export, React Native `App.tsx` export, design tokens, project backup, and backup import. Android exports use the native share sheet.

## Optional accounts, AI, and server backups

The active mobile backend is `server/`, a Node 22.19+ service with SQLite persistence, scrypt password hashing, hashed revocable session tokens, request validation, origin allowlisting, and rate limits. The earlier Express/Prisma scaffold under `backend/` is preserved but is **not used by the new mobile app**.

1. Copy `server/.env.example` to `server/.env`.
2. To enable AI, set `GEMINI_API_KEY` and `GEMINI_MODEL` to a text-and-vision model available to your Google AI Studio account. Never put credentials in the frontend or `VITE_` variables.
3. Run `npm run server`. The default address is `http://127.0.0.1:3001`.
4. In the web app's **Account** tab, save that address, choose **Create account**, and sign in. For a physical Android phone, deploy this service behind HTTPS and use that HTTPS URL. A phone's `localhost` is the phone, not your computer.
5. Select **Connected AI** when creating a project. You can optionally attach a screenshot or sketch (PNG/JPEG/WebP, up to 4 MB). The assistant uses AI when signed in.

The Gemini adapter sends the brief, shared design schema, current design for refinements, and optional image to the provider. Model results are validated before replacing local work. Invalid responses, timeouts, and missing credentials leave saved projects unchanged. Requests have bounded timeouts and quotas. The UI shows provider failures and does not silently substitute templates.

Server backups are explicit: **Back up projects to server** uploads local projects; **Restore projects from server** retrieves them. No background sync is claimed. Local JSON imports receive fresh project IDs to avoid overwriting work. Server restoration asks before replacing matching IDs.

For deployment: set `HOST=0.0.0.0` inside your host/container, terminate HTTPS at a trusted proxy, use a persistent volume for `server/data`, allow only your app/web origins, and set `ALLOW_REGISTRATION=false` after creating your private account if the server is personal. Configure proxy-level rate limits if needed; the service deliberately does not trust arbitrary forwarded-IP headers. SQLite is intended for a single server instance. Back up the database with SQLite-aware tooling, including WAL state. Sessions expire after 24 hours and are kept in app memory, so reopening the app requires signing in again. Do not deploy the older scaffold alongside this API as though it were the active service.

## Verification

```sh
npm run build
npm run typecheck:server
npm run lint
npm test
npm run test:e2e
```

Browser tests use locally installed Microsoft Edge with phone and desktop viewports and test the production bundle (`npm run build` first). They cover creation, editing, persistence across reload, local refinement, prototype navigation, review, version restore, actual HTML download/navigation, favorites, and invalid imports. API tests use an isolated database. Provider tests use an injected response, not paid live calls.

`scripts/smoke-android.mjs` tests native creation, persistence across a force-stop/relaunch, file export, and the Android share sheet. Run it only against a disposable emulator with ADB available (or set `ADB_PATH`); it installs the debug APK and creates a test project.

An optional API container definition is provided at `server/Dockerfile` (build context: repository root). Its container deployment has not been exercised here; local server startup and API behavior have been tested.

## Scope and remaining setup

No provider credentials or hosting were available during implementation. Live AI calls, real screenshot interpretation, internet deployment, and physical-phone network access therefore require configuration and verification. This is a functional local design app with an optional AI backend, not completion of every advanced item in the original vision.

The following are not implemented: original image generation, trained UI object detection, Figma import/export, Flutter export, PDF/PNG export, a freeform drag-and-drop canvas, live team collaboration, vector retrieval, public share links, OAuth/password recovery/email verification, billing, and an app-store release. Image elements are placeholders. Generated products are interactive design prototypes; they do not acquire real payment or business backends automatically.

Technical references: [Capacitor Android workflow](https://capacitorjs.com/docs/android) and [Gemini generateContent API](https://ai.google.dev/api/generate-content).
