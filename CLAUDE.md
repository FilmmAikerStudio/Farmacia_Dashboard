# CLAUDE.md — Farmacia Barcelona Dashboard

AI assistant context for the **Farmacia Barcelona - Dashboard SOP** project. Read this before making any changes.

---

## Project Overview

A professional frontend dashboard for **Farmacia Barcelona** (pharmacy) tracking digital marketing ROI, social media performance, content analytics, SEO positioning, financial data, and task management (SOP). Built for Teresa García (Directora Farmacéutica) and FilmmAker Studio.

**This is a frontend-only application with no backend or database.** All data comes from mock service functions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2.4 |
| Language | TypeScript 5.8.2 |
| Build Tool | Vite 6.2.0 (SWC) |
| Styling | Tailwind CSS v3 (CDN-loaded) |
| Charts | Recharts 3.7.0 |
| Icons | Lucide React 0.563.0 |
| Backend | None |
| Database | None |
| Tests | None |

---

## Directory Structure

```
Farmacia_Dashboard/
├── index.html              # HTML shell — Tailwind CDN, fonts, import maps
├── index.tsx               # React DOM entry point
├── App.tsx                 # Root component — global state (activeTab, darkMode, isLoading)
├── constants.tsx           # NAV_ITEMS array and THEME_COLORS config
├── types.ts                # All TypeScript interfaces/types
├── vite.config.ts          # Vite config — port 3000, @ path alias
├── tsconfig.json           # TS config — ES2022, strict, noEmit
├── package.json            # Scripts and dependencies
├── metadata.json           # App name/description metadata
├── components/
│   ├── Layout.tsx          # Sidebar + header shell, navigation state
│   ├── DashboardOverview.tsx  # Default overview tab content
│   └── BentoCard.tsx       # Reusable BentoCard + HeroMetric card components
└── services/
    └── mockData.ts         # All mock data factory functions
```

---

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
```

The dev server binds to `0.0.0.0:3000` (accessible from LAN).

---

## Architecture & Data Flow

```
App.tsx (global state)
  └── Layout.tsx (navigation shell)
        └── [content based on activeTab]
              ├── DashboardOverview.tsx
              ├── Social, Content, Web, ROI, SOP, Activity, Settings
              │   (all rendered inline in App.tsx)
              └── All data from services/mockData.ts
```

**State is managed at the `App.tsx` level:**
- `activeTab: string` — controls which view renders
- `darkMode: boolean` — persisted to `localStorage` key `'theme'`
- `isLoading: boolean` — 800ms initial spinner on mount

**`darkMode` is passed as a prop to all components.** Components do not manage their own theme state.

---

## Navigation

Navigation is **tab-based state** (not React Router). Tabs are defined in `constants.tsx`:

| Tab ID | Label | Content |
|---|---|---|
| `overview` | Resumen | KPI cards, sales chart, conversion funnel |
| `social` | Social | Per-platform social media analytics |
| `content` | Contenido | Content performance table |
| `web` | SEO/Web | Google My Business + keyword rankings |
| `roi` | ROI | Financial charts, ROAS, spend |
| `sop` | SOP | Task board / Standard Operating Procedures |
| `activity` | Log | Activity log timeline |
| `settings` | Ajustes | User profile + integration status |

---

## Key Conventions

### TypeScript
- All types live in `types.ts`. Add new interfaces there, not inline.
- Strict mode is enabled — no implicit `any`.
- JSX is `.tsx` files only.

### Styling
- **Tailwind CSS only** — no CSS-in-JS, no external CSS files (except `index.html` custom classes).
- Dark mode is class-based. Components receive `darkMode: boolean` prop and apply conditional Tailwind classes manually.
- Card pattern: `rounded-2xl` borders, `backdrop-blur` glassmorphism effects.
- Gradient backgrounds use `THEME_COLORS` from `constants.tsx`.

### Components
- `BentoCard` — generic container with hover/shadow effects. Accepts `darkMode`.
- `HeroMetric` — KPI card with gradient header and trend indicator. Use for top-level metrics.
- New page-level views should follow the pattern in `App.tsx` (rendered inline in the tab switch block).

### Mock Data
- All data comes from `services/mockData.ts`. Functions are named `get<Resource>()`.
- When adding a new data shape, define its TypeScript interface in `types.ts` first, then add the factory function to `mockData.ts`.
- No real API calls exist. Do not add `fetch`/`axios` unless replacing the mock layer.

### Icons
- Use **Lucide React** exclusively. Import named icons from `lucide-react`.
- Do not import icon libraries from other packages.

---

## Type Reference

Key interfaces from `types.ts`:

```typescript
Period = '7d' | '30d' | '90d' | 'custom'

ContentItem { id, title, type, platform, reach, engagement, clicks, conversions, status }
FinancialData { month, sales, target, lastYear }
Task { id, title, assignee, deadline, priority, status }
SEOKeyword { keyword, position, change, volume }
ActivityLog { id, time, message, type }
FunnelData { name, value, label }
MetricCardProps { label, value, trend?, icon, color? }
```

---

## Environment Variables

Only one env variable is defined (in `vite.config.ts`), but it is **not used** in the application code:

```
GEMINI_API_KEY   # Defined in vite.config.ts — currently unused (legacy from template)
```

No `.env` file is required to run the project.

---

## Known Limitations

- **No tests** — no Vitest, Jest, or testing infrastructure exists.
- **No routing** — navigation is tab state only; browser back/forward do not navigate.
- **No code splitting** — the entire app is one bundle; consider `React.lazy` for large additions.
- **No memoization** — all components re-render on any `App.tsx` state change; use `React.memo`/`useMemo` if adding expensive computations.
- **Tailwind via CDN** — not purged; not suitable for production without switching to a local Tailwind install.
- **Mock data only** — no persistence; all data resets on page refresh.

---

## Git Workflow

- Active development branch: `claude/add-claude-documentation-H0a9h`
- Main branch: `main`
- Commit messages should be concise and in English.
- Push with: `git push -u origin <branch-name>`
