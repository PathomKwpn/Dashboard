# Pathom Dashboard

A frontend dashboard project built with React and TypeScript. It focuses on security log monitoring, log analytics, geo-based threat detection, and reporting workflows.

## Portfolio Summary

Pathom Dashboard is a frontend-only portfolio project based on the idea of a security operations dashboard.

There is no real backend in this project. Instead of calling a live API, the app fetches prepared JSON files from `public/mock/` to simulate API responses. That setup makes it easy to show the full product flow, UI states, charts, tables, and interactions without needing a server or database.

The main goal of the project is to show frontend architecture, state management, routing, data visualization, and dashboard UX in a realistic product-style interface.

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
|-- components/       # Shared UI components and charts
|-- hooks/            # useAuth, useTheme
|-- layouts/          # Sidebar, Header, MainLayout
|-- pages/            # Feature pages with co-located slice, thunks, and types
|-- router/           # Route definitions
|-- store/            # Redux store
`-- services/         # API service layer and mock services
```

This project does not use a real backend. Data is loaded by fetching static JSON files from `public/mock/`, so the API layer is mocked on the frontend side.

## Limitations

- Authentication and JWT refresh are simulated in the browser for demo purposes.
- Export generation is handled on the client and creates sample downloadable files from the selected filters.
- Mock data is static and is mainly there to demonstrate the frontend experience, state flow, and dashboard features.
