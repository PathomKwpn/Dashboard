# Overview

Dashboard
├ KPI Summary
├ Log Volume Trend
├ Top Source IP
├ Top Services
└ Recent Alerts

Log Explorer
├ Search
├ Filters
├ Log Table
└ Log Detail

Log Detection
├ Geo Map
├ Attack Statistics
├ Suspicious IP
├ Detection Rules
└ Detection Events

Log Report
├ Report List
├ Error Summary
├ Traffic Summary
├ Log Distribution
└ Export

Log Analytics
├ Error Rate
├ Status Code Distribution
├ Top Endpoints
├ Slow Endpoints
├ User Agent
└ Service Performance

---

# Tech Stack

- React
- TypeScript
- TanStack Query
- Zustand
- TailwindCSS
- Chart Library (เช่น Recharts)
- Table Library (เช่น TanStack Table)
- Map Library (เช่น Leaflet)

---

# Application Layout

```
+------------------------------------------------------+
| Header                                               |
| Logo | Global Search | Time Filter | Notifications   |
+----------------------+-------------------------------+
| Sidebar              | Page Content                  |
|                      |                               |
| Dashboard            |                               |
| Log Explorer         |                               |
| Log Detection        |                               |
| Log Report           |                               |
| Log Analytics        |                               |
+----------------------+-------------------------------+
```

---

# Modules

## 1. Dashboard

หน้าภาพรวมของระบบสำหรับดูสถานะ log อย่างรวดเร็ว

### Components

- KPI Summary Cards
- Log Volume Trend Chart
- Log Level Distribution Chart
- Top Source IP Table
- Top Services Table
- Recent Alerts Table

### Data Displayed

- Total logs
- Error logs
- Warning logs
- Unique source IP
- Active services
- Alerts triggered
- Log trend over time

---

# 2. Log Explorer

หน้าสำหรับค้นหาและสำรวจ log แบบละเอียด

### Components

- Search Bar
- Filter Panel
- Log Table
- Log Detail Drawer
- Pagination

### Filters

- Date range
- Service
- Severity
- HTTP status
- IP address
- Country

### Log Table Fields

| Field       | Description      |
| ----------- | ---------------- |
| Timestamp   | เวลาเกิด log     |
| Service     | ระบบที่สร้าง log |
| Level       | severity         |
| IP Address  | source IP        |
| Endpoint    | API endpoint     |
| Status Code | HTTP status      |
| Message     | log message      |

### Log Detail View

- full JSON log
- request method
- response time
- hostname
- user agent

---

# 3. Log Detection (Geo Map)

ใช้ตรวจจับพฤติกรรมผิดปกติของ traffic

### Components

- Geo Map Visualization
- Suspicious IP Table
- Attack by Country Chart
- Detection Events Table

### Data Displayed

- Source IP location
- Attack origin country
- Suspicious login attempts
- Detection events
- Security alerts

---

# 4. Log Report

หน้าสำหรับสร้างและจัดการรายงาน log

### Components

- Report Generator
- Report List Table
- Error Summary Chart
- Traffic Summary Chart
- Top Endpoints Table

### Features

- Generate reports by date range
- View saved reports
- Export reports

### Export Formats

- CSV
- JSON
- PDF

---

# 5. Log Analytics

หน้าวิเคราะห์ log เชิงลึก

### Components

- Error Rate Trend Chart
- Status Code Distribution Chart
- Top Endpoints Table
- Slowest Endpoints Table
- User Agent Chart
- Service Performance Chart

### Analytics Metrics

- Error rate
- Status code distribution
- Most requested endpoints
- Slow response endpoints
- Browser / device usage
- Service response performance

---

# Example Log Data Model

```json
{
  "timestamp": "2026-03-07T10:22:12Z",
  "service": "auth-service",
  "level": "error",
  "ip": "45.23.12.9",
  "country": "China",
  "endpoint": "/login",
  "method": "POST",
  "status": 401,
  "response_time": 120,
  "message": "login failed"
}
```

---

# Core UI Components

### Layout

- AppLayout
- Sidebar
- Header
- PageContainer

### Dashboard

- StatCard
- LineChart
- PieChart
- DataTable

### Logs

- LogTable
- LogDetailDrawer
- SearchBar
- FilterPanel

### Detection

- GeoMap
- AttackTable
- CountryChart

---
