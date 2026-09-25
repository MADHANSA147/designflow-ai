# DesignFlow AI delivery — 25 September 2026

## Deliverables

- `artifacts/DesignFlow-AI-debug.apk` — installable development APK, package `com.designflow.ai`, Android API 24 minimum, API 36 target.
- `src/app/` — active frontend, schema, local storage, API client, and code exporters.
- `server/` — optional account, backup, and AI service with durable SQLite storage.
- `android/` — native Android project, branded splash and adaptive icon, filesystem/share/preferences integrations.
- `scripts/build-android.ps1` — reproducible Windows build and APK copy.
- `README.md` — setup, installation, configuration, and explicit scope limits.

## Verified

- Production frontend build and frontend TypeScript check passed.
- Server/test TypeScript check and application/server/test lint passed.
- 9 automated unit/API tests passed.
- 4 production-bundle workflow tests passed across phone and desktop viewports.
- Android debug build succeeded; APK package name, launcher activity, minimum SDK, and target SDK inspected.
- Installed and launched on an isolated Android 16 emulator. Created a native project, force-stopped and reopened the app, and verified the project persisted. Verified the exported project JSON in native cache. Android activity inspection confirmed the share chooser was launched. UIAutomator inspection timed out and the share screenshot was blank on the overloaded emulator, so visual share-sheet rendering and delivery to a recipient app still need a physical-device check. The complete native smoke script has not passed end to end.
- Dependency audit after updating build tooling reported zero known vulnerabilities for the active root project. This does not cover the unused historical `backend/` scaffold.
- Server starts without credentials and reports `ai: false`, while local app features remain available.
- Live provider calls were not run: no AI key or provider account was supplied.

## Product scope

This build completes the local structured-design workflow and provides a configurable AI backend. It does **not** implement every advanced capability in the original concept. Local generation and commands are explicitly labeled templates/local. Review findings are measured rules rather than a fabricated AI score. Generated applications are prototypes, with preview-only inputs and no real checkout backend.

To activate original AI generation and screenshot/sketch interpretation, configure a Gemini key/model on the server, deploy it behind HTTPS, and connect the Android app to that endpoint. Provider behavior and production hosting still require live verification. App-store signing/publication also remains separate from this debug APK.

See the README's scope section for deferred features, including trained vision, freeform canvas editing, collaboration, Flutter/Figma/PDF/image exports, and public prototype hosting.
