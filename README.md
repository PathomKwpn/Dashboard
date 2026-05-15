# Pathom Dashboard

A security log monitoring dashboard built with React and TypeScript. It visualizes log analytics, geo-based threat detection, and event anomalies with static mock data so the full product flow can be deployed without a backend.

## Portfolio Summary

Pathom Dashboard is a frontend case study for a security operations dashboard.

Key capabilities:

- Protected demo login with role-based navigation
- Security KPI overview, severity trends, top IPs, top services, and recent alerts
- Log explorer with search, filters, sorting, pagination, and detail drawer
- Geo detection with world map, suspicious IPs, country breakdown, and event tables
- Report center with summary tabs and downloadable CSV, JSON, NDJSON, or HTML exports
- Dark/light theme support and responsive dashboard layout

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Form & Validation | React Hook Form + Zod |
| Charts | Apache ECharts |
| Styling | Tailwind CSS |
| HTTP | Axios |
| Icons | Lucide React |

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Overview: log volume, severity trends, recent alerts |
| `/log-explorer` | Search and filter raw log entries |
| `/geo-detection` | World map of attack origins and suspicious IPs |
| `/log-report` | Generated reports, error summaries, exports |
| `/log-analytics` | Endpoint performance, error rates, user agents |
| `/settings` | Theme, notifications, data retention (admin only) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@pathom.com | admin123 |
| Business | user@pathom.com | password123 |
| Developer | dev@pathom.com | dev123 |

## Verification

```bash
npm run lint
npm run build
```

## Deployment

This is a static Vite app. Recommended settings:

| Platform | Build Command | Output Directory |
|---|---|---|
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |

SPA fallback is configured through `vercel.json` and `public/_redirects`.

## Project Structure

```text
src/
├── components/       # Shared UI components and charts
├── hooks/            # useAuth, useTheme
├── layouts/          # Sidebar, Header, MainLayout
├── pages/            # Feature pages with co-located slice, thunks, and types
├── router/           # Route definitions
├── store/            # Redux store
└── services/         # API service layer and mock services
```

All API calls use static JSON files under `public/mock/`; no backend is required.

## Limitations

- Authentication and JWT refresh are simulated in the browser for portfolio/demo use.
- Export generation is client-side and creates sample downloadable files from selected filters.
- Mock data is static and intended to demonstrate UI, state management, and dashboard workflows.
