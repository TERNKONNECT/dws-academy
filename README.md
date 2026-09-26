# DWS Academy — Frontend

The public site and learning platform for **School of Events Africa** (schoolofeventsafrica.com): a marketing homepage, course catalog, learner dashboard (video lessons, quizzes, certificates), book preorder flow, and an admin dashboard, all in one React SPA.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, built with Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Server state | TanStack Query (`@tanstack/react-query`) |
| Client state | Zustand (`persist` middleware for auth/session) |
| Forms | React Hook Form + Zod |
| Theming | `next-themes` (class-based light/dark, see [Theming](#theming)) |
| Charts | Chart.js / react-chartjs-2, Recharts |
| Certificates/PDF | jsPDF, html2canvas |
| Testing | Vitest + Testing Library (unit), Playwright (e2e) |
| Package manager | npm (repo also ships `bun.lock`/`bun.lockb`; CI uses Bun — either works) |

## Prerequisites

- Node.js 18+ (or Bun, since CI runs on Bun)
- The [dws-academy-server](../dws-academy-server) API running locally (or a reachable deployment) for anything beyond static marketing pages

## Getting started

```bash
npm install       # also wires up the pre-commit hook, see below
cp .env.example .env
# edit .env — set VITE_API_BASE_URL to your backend, e.g. http://localhost:9000
npm run dev
```

The dev server runs at **http://localhost:8080** (fixed port, set in `vite.config.ts`).

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:9000` locally, the production API domain when deployed). Consumed via `import.meta.env.VITE_API_BASE_URL` in `src/services/api.ts`, `src/api/*`, and `src/stores/authStore.ts`. |

There's no `.env` fallback baked into the client except the auth store, which defaults to `http://localhost:9000` if the variable is unset — set it explicitly for anything else.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build in development mode (unminified, useful for debugging a build-only issue) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm run typecheck` | `tsc --noEmit` against `tsconfig.app.json` |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run verify` | typecheck + lint + test — the same gate CI and the pre-commit hook run |

## Project structure

```
src/
  api/            Typed fetch/axios clients per resource (courses, enrollments, payments, preorders, ...)
  components/
    admin/         Admin-dashboard-only components
    certificate/   Certificate rendering (jsPDF/html2canvas)
    gallery/       Events gallery
    home/          Homepage marketing sections (Hero, Books, Insights, Testimonials, ...)
    layout/        Admin dashboard shell (DashboardLayout)
    layouts/        Public site shell (MainLayout — nav, footer, newsletter)
    shared/        Cross-cutting reusable components
    ui/            shadcn/ui primitives (button, dialog, input, ...) — generally left as generated
    video/         Course video player + progress tracking
  contexts/        React context providers (AuthContext)
  data/            Static/reference data
  hooks/           Shared hooks
  lib/             Utilities (session handling, cn/className helpers, etc.)
  pages/           Route-level components (see Routing below)
    admin/         Admin dashboard pages, rendered inside DashboardLayout
  services/        Higher-level API service layer (src/services/api.ts)
  stores/          Zustand stores (authStore, enrollmentStore)
  test/            Vitest unit tests, mirrors src/ structure
  types/           Shared TypeScript types
  utils/           Misc helpers
```

Path alias: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Routing

Defined in `src/App.tsx`. Three tiers:

- **Public**: `/`, `/login`, `/signup`, `/verify-email`, `/contact`, `/about`, `/courses`, `/courses/:id`, `/gallery`, `/team`, `/services`, `/faq`, `/get`, `/books/money-on-the-table` (+ `/preorder`, `/preorder/success`), `/verify-certificate(/:certificateId)`, `/payment/failed`
- **Protected (learner)**: wrapped in `<ProtectedRoute>` — `/my-learning`, `/learn/:courseId`, `/learn/:courseId/quiz/:quizId`, `/certificate/:courseId`, `/profile`, `/payment/success`
- **Admin**: `/dashboard/*`, wrapped in `<ProtectedAdminRoute>` and rendered inside `DashboardLayout`. A stricter `<StrictAdminRoute>` further gates sensitive pages (`analytics`, `revenue`, `events-gallery`, `testimonials`, `faculty`, `newsletter`, `book-preorders`, `instructors(/:id)`).

Most non-entry pages are **code-split** with `React.lazy` — only `Index`, `Login`, and `NotFound` are eagerly bundled, so a homepage visitor never downloads the admin dashboard, Chart.js, jsPDF, or html2canvas.

`ScrollToHash` (mounted once inside `<BrowserRouter>`) handles scrolling to a `#section` id when navigating to a hash link from a different route or on a fresh page load — React Router doesn't do this on its own.

## State management

- **Server data** (courses, testimonials, enrollments, etc.) goes through TanStack Query via `src/services/api.ts` and `src/api/*` — 5 min stale time, no refetch-on-window-focus (see `queryClient` config in `App.tsx`).
- **Auth/session** lives in `useAuthStore` (`src/stores/authStore.ts`), persisted to storage via Zustand's `persist` middleware. `AuthContext` (`src/contexts/AuthContext.tsx`) wraps the app for consumers that prefer context over the store directly.
- **Enrollment progress** has its own store, `useEnrollmentStore`.

## Theming

Light/dark mode is handled by `next-themes` with `attribute="class"` (`App.tsx`), toggled via the `ThemeToggle` component in the public nav. Color tokens are CSS variables defined in `src/index.css` (`:root` for light, `.dark` for dark), mapped into Tailwind via `tailwind.config.ts` (`darkMode: ["class"]`).

Two patterns exist side by side, and it matters which one a component uses:

- **Theme-aware** components should use the semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, etc.) so they automatically flip with the theme.
- **Fixed-light marketing sections** (most of `components/home/*`, e.g. `Books`, `Insights`) intentionally hardcode light colors (`bg-white`, `bg-[#F7F6F3]`, `text-[#0B0B0C]`) because the homepage is designed to always look the same regardless of the visitor's theme preference.

When adding new UI, don't mix the two — a hardcoded text color inside a section that itself switches backgrounds with `dark:bg-...` is the most common way to end up with invisible (dark-on-dark or light-on-light) text.

## Testing

- **Unit/component tests**: Vitest + Testing Library, under `src/test/`, mirroring the `src/` layout. Setup file: `src/test/setup.ts`. Run with `npm run test` or `npm run test:watch`.
- **E2E**: Playwright, configured via `playwright.config.ts` (extends a shared `lovable-agent-playwright-config`). `playwright-fixture.ts` provides shared fixtures.

## Git hooks

`npm install` runs `prepare`, which sets `core.hooksPath` to `.githooks`. The `pre-commit` hook runs the same checks as CI (typecheck, lint, test) before allowing a commit, so a broken build is caught locally. Skip deliberately with `git commit --no-verify` if you must.

## CI/CD

`.github/workflows/deploy-frontend.yml`:

1. **On every push/PR to `main`**: install deps (Bun), typecheck, lint, test, build.
2. **On push to `main` only**: rebuild with `VITE_API_BASE_URL` injected from a GitHub secret, then sync `dist/` to an S3 bucket and invalidate the CloudFront distribution (both via AWS OIDC credentials).

The S3 bucket and CloudFront distribution are provisioned via Terraform in `infrastructure/` (`main.tf`, `variables.tf`, `outputs.tf`).

## Building for production

```bash
npm run build
```

Output goes to `dist/`, ready to be served as a static SPA (all unmatched routes should fall back to `index.html` — see the CloudFront/S3 setup in `infrastructure/` for how that's wired in production).
