# Project Overview

Frontend Dashboard โชว์ log management ต่างๆ

---

## Modules

### Dashboard `/dashboard`

ภาพรวมสถานะระบบแบบ real-time

- **KPI Cards** — Total Logs, Critical Alerts, Error Rate, Avg Response Time (พร้อม % change)
- **Log Volume Trend** — Line chart 24h + 24h average
- **Log Level Distribution** — Bar/Pie chart แยก severity
- **Top Source IPs** — Top10 IP ที่มี log สูงสุด พร้อม threat level + progress bar
- **Top Services** — Top10 service พร้อม status, error rate, progress bar
- **Recent Alerts** — ตาราง alert ล่าสุดพร้อม pagination + checkbox

---

### Log Explorer `/log-explorer`

ค้นหาและสำรวจ log แบบละเอียด

- **Search Bar** — full-text search
- **Filter Panel** — กรองด้วย date range, service, severity, HTTP status, IP, country
- **Log Table** — คอลัมน์: Timestamp, Service, Severity, IP, Endpoint (method + path), HTTP Status, Response Time (ms), Message — sort ได้ทุกคอลัมน์, pagination, checkbox multi-select
- **Log Detail Panel** — slide-in drawer แสดง full JSON, request info, user agent, hostname

---

### Geo Detection `/geo-detection`

ตรวจจับภัยคุกคามแบบ geographic

- **KPI Cards** — Detection Events, Suspicious IPs, Origin Countries, Blocked Attacks
- **Geo Map** — World map แสดง attack origins (react-simple-maps + ECharts)
- **Attack by Country** — Bar chart จำนวน attack แยกประเทศ
- **Suspicious IPs** — ตาราง IP + country flag + attack type + threat level + status (blocked/monitoring/whitelisted) + pagination + checkbox
- **Detection Events** — ตาราง events พร้อม expand row แสดง detail + pagination + checkbox

---

### Log Report `/log-report`

สร้างและจัดการรายงาน (tab-based)

- **Report List** — ตาราง report ที่สร้างแล้ว พร้อม status (ready/generating/failed), format, size, download
- **Error Summary** — KPI (total errors, error rate, most affected service) + hourly bar chart + errors by service + error type breakdown
- **Traffic Summary** — KPI (total requests, avg RPS, peak RPS) + line chart traffic over time + method breakdown (GET/POST/PUT/DELETE)
- **Log Distribution** — Pie chart severity + breakdown table + bar chart volume by service
- **Export** — Config form: format (CSV/JSON/NDJSON/PDF), date range, service filter, severity filter, max rows + generate button

---

### Log Analytics `/log-analytics`

วิเคราะห์ log เชิงลึก (tab-based)

- **Error Rate** — KPI (current rate, 24h avg, SLA breaches) + line chart error rate vs SLA threshold (10%)
- **Status Code Distribution** — Summary cards per group (2xx/3xx/4xx/5xx) + pie chart + bar chart by service
- **Top Endpoints** — ตาราง top 10 by request count: method badge + path + avg ms + p95 ms + error% + traffic bar
- **Slow Endpoints** — ตาราง top 8 by p95 latency: p50/p95/p99 color-coded (green/amber/red)
- **User Agent** — Type summary (browser/mobile/bot/api) + pie chart + top agents table พร้อม icon
- **Service Performance** — ตาราง: RPS, avg latency, p95 latency, error rate, uptime + mini sparkline + status badge

---

## Layout

```
+----------------------------------------------------------+
| Header: Search | Theme Toggle | Notifications | Profile   |
+------------------+---------------------------------------+
| Sidebar          | Page Content (max-w-7xl)              |
|                  |                                       |
| General          | Page Header (title + description)     |
|  Dashboard       |                                       |
|  Messages (8)    | Content                               |
|                  |                                       |
| Tools            |                                       |
|  Events          |                                       |
|  Log Explorer    |                                       |
|  Geo Detection   |                                       |
|  Log Report      |                                       |
|  Log Analytics   |                                       |
|                  |                                       |
| Support          |                                       |
|  Settings*       |                                       |
|  Security**      |                                       |
|  Help            |                                       |
+------------------+---------------------------------------+
* admin only  ** admin + business
```

**Sidebar** — collapsible (w-60 ↔ w-16), role-based item visibility, tooltip เมื่อ collapsed

**Header** — sticky, blur backdrop, notification bell (poll ทุก 1 นาที, มี unread count badge, dropdown panel), theme toggle (dark/light)

---

## Tech Stack

| Category      | Library                                |
| ------------- | -------------------------------------- |
| Framework     | React 19 + TypeScript                  |
| Build         | Vite 7                                 |
| Routing       | React Router v7                        |
| State         | Redux Toolkit + react-redux            |
| UI Components | shadcn/ui (Radix UI primitives)        |
| Styling       | Tailwind CSS v4 (Linear design system) |
| Icons         | Lucide React                           |
| Charts        | ECharts v6 (line, bar, pie, geo map)   |
| Map           | react-simple-maps + world-atlas        |
| Date          | Moment.js                              |
| HTTP          | Axios + axios-auth-refresh             |
| Forms         | React Hook Form + Zod                  |

---

## Project Structure

```
src/
├── components/
│   ├── charts/        LineChart, BarChart, PieChart, GeoMapChart
│   ├── common/        KPICard, TablePagination, ProtectedRoute
│   └── ui/            shadcn components (Button, Card, Badge, Table …)
├── layouts/
│   ├── header/        HeaderSearch, NotificationPanel, HeaderProfile
│   ├── sidebar/       nav.config.ts, SidebarBrand, SidebarSection, SidebarMenuItem
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── MainLayout.tsx
├── pages/
│   ├── Auth/          LoginPage
│   ├── Dashboard/     DashboardPage + 5 components
│   ├── Events/        EventsPage (placeholder)
│   ├── GeoDetection/  GeoDetectionPage + 5 components
│   ├── LogExplorer/   LogExplorerPage + 4 components
│   ├── LogReport/     LogReportPage + 5 tab components
│   └── LogAnalytics/  LogAnalyticsPage + 6 tab components
├── router/            routes.tsx
└── store/             Redux store + slice per module
```

---

## Data Model (Log Entry)

```json
{
  "id": "uuid",
  "timestamp": "2026-04-13T10:22:12Z",
  "service": "auth-service",
  "severity": "error",
  "source_ip": "45.23.12.9",
  "country": "China",
  "country_code": "CN",
  "endpoint": "/api/v2/auth/login",
  "http_method": "POST",
  "http_status": 401,
  "response_time_ms": 118,
  "message": "JWT verification failed: token expired",
  "hostname": "auth-pod-3a",
  "user_agent": "Chrome/124"
}
```
