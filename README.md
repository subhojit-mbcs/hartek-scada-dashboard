# Hartek 5 MW Solar SCADA Dashboard

> Real-time monitoring dashboard for the Hartek 5 MW Solar Plant in Jalandhar, Punjab.
> Built with React 18 + Flask + Recharts. Proxies the live SCADA API at `mbscada.com`.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Running the Application](#5-running-the-application)
6. [Login & Authentication](#6-login--authentication)
7. [Pages & Routes](#7-pages--routes)
8. [Components](#8-components)
9. [Inverter Parameters (27 Total)](#9-inverter-parameters-27-total)
10. [API Endpoints](#10-api-endpoints)
11. [Data Flow](#11-data-flow)
12. [Color Theme & Styling](#12-color-theme--styling)
13. [Mock Data vs Live Data](#13-mock-data-vs-live-data)
14. [Production Build & Deployment](#14-production-build--deployment)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (User)                          │
│   http://localhost:5000                                    │
└──────────────┬───────────────────────────────┬────────────┘
               │  GET /                         │  GET /api/data
               │  (SPA fallback → index.html)   │  (every 5s)
               ▼                                ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│   Flask Backend (5000)    │   │   React Frontend (Vite)      │
│                           │   │                              │
│   GET /api/data           │──▶│   fetchScadaData()           │
│   GET /api/refresh        │   │   → api/index.js             │
│   GET /* → index.html     │   │                              │
│                           │   │   AuthContext.jsx            │
│   Cache (in-memory):      │   │   sessionStorage auth        │
│   - site, inverter, mfm   │   │                              │
│   - performance, weather  │   │   Recharts charts            │
│   - token, last_update    │   │   Inline styles only         │
└──────────┬────────────────┘   └──────────────────────────────┘
           │  ┌──────────────────┐
           │  │ Background Thread │  (every 30s)
           │  │ refresh_data()   │
           │  └────────┬─────────┘
           │           │ POST /api/auth/login → JWT
           │           │ GET /api/site/
           │           │ GET /api/inverter?siteId=HARTEK01
           │           │ GET /api/mfm?siteId=HARTEK01
           │           │ GET /api/performance?siteId=HARTEK01
           │           │ GET /api/weather?siteId=HARTEK01
           ▼           ▼
┌──────────────────────────────────────────────────────────┐
│              External SCADA API                            │
│         https://mbscada.com/hartek/server                  │
└──────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- Flask acts as a **caching proxy** — polls the external SCADA API every 30 seconds, stores data in memory, and serves it to the frontend on demand. This avoids hammering the upstream API with every browser request.
- Frontend polls `/api/data` every **5 seconds** for near-real-time updates.
- All styling is **inline JavaScript objects** — no CSS files, no CSS modules, no styled-components.

---

## 2. Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.8+ | For Flask backend |
| Node.js | 18+ | For React frontend build |
| npm | 9+ | For dependency installation |
| Browser | Modern | Chrome/Firefox/Edge |

---

## 3. Project Structure

```
hartek-scada-dashboard/
│
├── backend/
│   └── app.py                  ← Flask API proxy server (128 lines)
│
├── frontend/
│   ├── index.html              ← HTML entry point (Inter font, title)
│   ├── package.json            ← Dependencies (React 18, Recharts, React Router)
│   ├── vite.config.js          ← Vite config (port 5173, proxy /api → :5000)
│   ├── dist/                   ← Production build output
│   │   ├── index.html
│   │   └── assets/
│   │       └── index-*.js      ← Built JS bundle
│   │
│   └── src/
│       ├── main.jsx            ← React entry point (BrowserRouter + App)
│       ├── App.jsx             ← Root: AuthProvider, Routes, ProtectedRoute
│       ├── AuthContext.jsx     ← Login/logout state management
│       │
│       ├── api/
│       │   └── index.js        ← API client: fetchScadaData(), data helpers
│       │
│       ├── components/
│       │   ├── Layout.jsx      ← Page shell: Header + Sidebar + content area
│       │   ├── Header.jsx      ← Top bar: logo, clock, status, user dropdown
│       │   ├── Sidebar.jsx     ← Navigation: 7 menu items, collapsible
│       │   ├── PlantOverview.jsx    ← Site banner: name, lat/lng, stats
│       │   ├── PerformanceGauge.jsx ← Semi-circle PR gauge with needle
│       │   ├── KPICards.jsx         ← 8 KPI cards (load, gen, weather)
│       │   ├── WeatherDashboard.jsx ← 7 weather params + today summaries
│       │   ├── InverterAnalytics.jsx← Inverter cards + generation chart
│       │   ├── InverterGraph.jsx    ← 27-parameter detail view (NEW)
│       │   ├── MFMSection.jsx       ← Multi-function meter cards
│       │   └── PerformanceAnalytics.jsx ← PR metrics + monthly bar chart
│       │
│       └── pages/
│           ├── Login.jsx       ← Login form with demo credentials
│           ├── Dashboard.jsx   ← Main dashboard: all components composed
│           ├── Inverters.jsx   ← InverterAnalytics + InverterGraph
│           ├── Weather.jsx     ← WeatherDashboard + extra metrics
│           ├── EnergyMeter.jsx ← Full MFM details (13 params each)
│           ├── Annunciator.jsx ← Alarm table (mock data)
│           ├── Reports.jsx     ← Report type cards + date range + export
│           └── Settings.jsx    ← Connection, notifications, display, account
│
└── README.md                   ← This file
```

**Total: 23 source files** (excluding `node_modules/`, `dist/`, `package-lock.json`)

---

## 4. Installation & Setup

### Step 1: Clone / Navigate to the Project

```bash
cd C:\Users\subhojit.g\Desktop\hartek-scada-dashboard
```

### Step 2: Install Python Dependencies

No external Python packages are required beyond Flask (stdlib `threading`, `requests`, `logging`, `os`, `json`, `datetime`). If you need to install Flask:

```bash
pip install flask requests
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- `react` / `react-dom` (^18.2.0)
- `react-router-dom` (^6.20.0)
- `recharts` (^2.10.0)
- `lucide-react` (^0.294.0 — declared but **unused**)
- `vite` (^5.0.0)
- `@vitejs/plugin-react` (^4.2.0)

### Step 4: Build the Frontend

```bash
npm run build
```

This produces the production bundle in `frontend/dist/`.

---

## 5. Running the Application

### Start the Flask Backend

```bash
# From the project root (hartek-scada-dashboard/)
python backend/app.py
```

The server starts on **http://0.0.0.0:5000**.

**What happens at startup:**
1. A background thread (`refresh_data`) starts immediately
2. It sleeps 3 seconds, then logs into the SCADA API
3. It fetches all 5 data endpoints (site, inverter, mfm, performance, weather)
4. Data is stored in an in-memory `cache` dict protected by `threading.Lock`
5. Flask starts listening on port 5000
6. The background thread continues polling every 30 seconds

**Expected console output:**
```
Starting background data refresher...
Data refreshed
 * Serving Flask app 'app'
 * Debug mode: off
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.0.155:5000
```

### Open in Browser

Navigate to **http://localhost:5000**

You will see the **Login page** first.

---

## 6. Login & Authentication

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | `admin` | `admin123` |
| Operator | `userHartek` | `Hartek@123` |

### How Authentication Works

1. **Login page** (`frontend/src/pages/Login.jsx`):
   - Shows the M.B. Control logo (loaded from `https://www.mbcontrol.com/wp-content/uploads/2025/09/mb-contorl-01-logo.svg`)
   - Username and password fields
   - "Sign In" button with a simulated 500ms delay
   - Error messages for invalid credentials

2. **AuthContext** (`frontend/src/AuthContext.jsx`):
   - Credentials are hardcoded in `VALID_CREDENTIALS` array
   - On successful login, stores `{ username, role, name }` in `sessionStorage`
   - `sessionStorage` means the session persists across page refreshes but clears when the tab is closed
   - `logout()` clears sessionStorage and sets `user` to `null`

3. **ProtectedRoute** (inside `App.jsx`):
   - Checks `user` from `useAuth()`
   - If no user → redirects to `/login`
   - If user exists → renders the app content
   - After successful login, redirects to `/dashboard`

### SCADA vs App Authentication

There are **two separate auth layers**:
- **App auth**: Username/password to access the dashboard (local demo credentials)
- **SCADA API auth**: The Flask backend logs into `mbscada.com` using its own hardcoded credentials (`userHartek / Hartek@123`) to fetch real plant data

---

## 7. Pages & Routes

All dashboards routes are **protected** (require login). The `/login` route is public.

| Path | Page | Props | Description |
|------|------|-------|-------------|
| `/login` | Login | none | Login form with logo and demo credentials |
| `/` | — | — | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | `data, loading` | Full plant overview with all widgets |
| `/inverters` | Inverters | `data, loading` | Inverter analytics + 27-parameter detail graph |
| `/weather` | Weather | `data, loading` | Weather station + extra metrics |
| `/energy-meter` | EnergyMeter | `data, loading` | Detailed MFM parameters (2 meters × 13 params) |
| `/annunciator` | Annunciator | `data` (unused) | Alarm table with search/filter/ack (mock data) |
| `/reports` | Reports | `data` (unused) | Report type cards, date range, export buttons |
| `/settings` | Settings | none | Connection info, notifications, display, account |

### Dashboard Page Layout

```
┌─────────────────────────────────────────────────┐
│  PlantOverview (gradient banner, 6 stat boxes)   │
├────────────────────────┬────────────────────────┤
│  PerformanceGauge      │  KPICards (2×4 grid)   │
│  (semi-circle PR arc)  │  load, gen, CUF, temp  │
├────────────────────────┴────────────────────────┤
│  WeatherDashboard (7 params + today summaries)   │
├─────────────────────────────────────────────────┤
│  InverterAnalytics (cards + generation chart)    │
├─────────────────────────────────────────────────┤
│  MFMSection (multi-function meter cards)         │
├─────────────────────────────────────────────────┤
│  PerformanceAnalytics (PR metrics + monthly bar) │
└─────────────────────────────────────────────────┘
```

---

## 8. Components

### 8.1 Layout (`components/Layout.jsx`)
- Flexbox row: `<Sidebar>` + `<main>` column
- Main column: `<Header>` + scrollable `<div>` content area
- Error banner shown at top of content if `error` prop is set
- Injects `data` and `loading` into child via `React.cloneElement`

### 8.2 Header (`components/Header.jsx`)
**Props:** `data, onRefresh, onMenuClick`

| Element | Description |
|---------|-------------|
| ☰ Menu button | Toggles sidebar |
| Company logo | `<img>` from remote URL `https://www.mbcontrol.com/wp-content/uploads/2025/09/mb-contorl-01-logo.svg` |
| Plant info | "MB Solar SCADA" / "Hartek 5 MW Plant" |
| Live clock | Updates every second, displayed in Indian locale format |
| Status badge | Online (green) if `site.siteStatus === 'G'`, else Offline (red) |
| ⟳ Refresh button | Calls `onRefresh` prop |
| 🔔 Notification bell | Hardcoded "3" badge count |
| User dropdown | Avatar initial + username + Logout button (calls `useAuth().logout()`) |

### 8.3 Sidebar (`components/Sidebar.jsx`)
**Props:** `open, onToggle`

- 7 navigation items with emoji icons:
  - ◉ Dashboard, ⚡ Inverters, 🌤 Weather Station, 🔋 Energy Meter, ⚠ Annunciator, 📊 Reports, ⚙ Settings
- Active route highlighted with `#38BDF8` color
- Collapsible: width 240px when open, 0 when closed
- Footer with copyright text

### 8.4 PlantOverview (`components/PlantOverview.jsx`)
- Reads site data via `getSiteData(data)` → `data?.site?.[0]`
- Gradient background card
- 6 stat boxes: Site ID, Capacity (hardcoded "5 MW"), Service Start, Service End, Inverters count, Last Active time

### 8.5 PerformanceGauge (`components/PerformanceGauge.jsx`)
- SVG-based semi-circle arc gauge (0°–180°)
- 3 colored segments: Green (0-70%), Yellow (70-90%), Red (90-100%) — note: lower PR is better
- Animated needle that rotates to the current PR value (transition: 1s ease-out)
- Below gauge: 4 value cards (Today, Yesterday, Monthly, Annual Target 85%)

### 8.6 KPICards (`components/KPICards.jsx`)
8 KPI cards in a flexible grid:

| # | Icon | Label | Source | Transformation |
|---|------|-------|--------|----------------|
| 1 | ⚡ | Plant Load (kW) | `inverter[0].AC_active_power.V` | ÷ 1000 |
| 2 | ☀️ | Today's Gen (MWh) | `inverter[0].Daily_generation.V` | ÷ 1,000,000 |
| 3 | 📈 | Daily CUF (%) | `performance.Daily_CUF.data` | Direct |
| 4 | 📊 | Daily AC Yield (kWh/kW) | `performance.DailyACYield.data` | Direct |
| 5 | 🌞 | GHI (W/m²) | `weather.GHI.V` | Direct |
| 6 | 🌤 | GII (W/m²) | `weather.GII.V` | Direct |
| 7 | 🌡 | Ambient Temp (°C) | `weather.AmbientTemp.V` | Direct |
| 8 | 💨 | Wind Speed (m/s) | `weather.WindSpeed.V` | Direct |

### 8.7 WeatherDashboard (`components/WeatherDashboard.jsx`)
- Reads weather via `getWeatherData(data)` → `data?.weather?.[0]?.data`
- 7 parameter cards: AmbientTemp, PVModuleTemp1, GHI, GII, WindSpeed, WindDirection, RainFall
- Bottom row: Today GHI (Wh/m²), Today GII (Wh/m²), Today Rainfall (mm)
- Graceful "No weather data" fallback if weather is null

### 8.8 InverterAnalytics (`components/InverterAnalytics.jsx`)
- Reads all inverters via `getInverterData(data)` → `data?.inverter`
- For each inverter:
  - 6 fields in a 2×3 grid: AC Power (kW), DC Power (kW), Daily Gen (MWh), Total Gen (MWh), Voltage (V), Current (A)
  - Efficiency badge (AC Power / DC Power × 100)
- Bottom "Today's Generation Trend" area chart with **hardcoded mock data** (11 time points from 00:00 to 23:00)

### 8.9 InverterGraph (`components/InverterGraph.jsx`) — 27 Parameters

This is the dedicated detail view for Inverter #1. See [Section 9](#9-inverter-parameters-27-total) for the full parameter list.

**Features:**
- **Group filter buttons**: All Parameters, AC, DC, Module Group 1, Module Group 2, Generation
- **Parameter cards**: Clickable grid showing live value, label, unit, color-coded
- **Selected card** gets a blue border (`#1D4ED8`)
- **Real-time trend chart**: Area chart. **Note**: The trend data is generated client-side using a sinusoidal mock curve based on the current live value — not historical time-series from the API.
- **Dropdown** to switch charted parameter
- **Info section**: Current value (large), parameter name, raw API value

### 8.10 MFMSection (`components/MFMSection.jsx`)
- Reads MFM data via `getMFMData(data)` → `data?.mfm`
- For each MFM, shows 13 parameters in a 2-column grid

### 8.11 PerformanceAnalytics (`components/PerformanceAnalytics.jsx`)
- 8 performance metric cards from SCADA performance endpoint
- Bottom monthly bar chart with **hardcoded mock data** (Jan–Jun, 6 months)

---

## 9. Inverter Parameters (27 Total)

These are all available on the **Inverters page** → "Inverter #1 — Detailed Parameters" section.

### AC Parameters (11)

| # | Key | Label | Unit | Divisor | Color |
|---|-----|-------|------|---------|-------|
| 1 | `AC_active_power` | AC Active Power | kW | 1000 | `#38BDF8` |
| 2 | `AC_reactive_power` | AC Reactive Power | kVAR | 1000 | `#F472B6` |
| 3 | `Apparent_Output` | Apparent Output | kVA | 1000 | `#A78BFA` |
| 4 | `Voltage_AB` | Voltage AB | V | 10 | `#34D399` |
| 5 | `Voltage_BC` | Voltage BC | V | 10 | `#22D3EE` |
| 6 | `Voltage_CA` | Voltage CA | V | 10 | `#818CF8` |
| 7 | `Current_R` | Current R | A | 1000 | `#EF4444` |
| 8 | `Current_Y` | Current Y | A | 1000 | `#EAB308` |
| 9 | `Current_B` | Current B | A | 1000 | `#22C55E` |
| 10 | `HZ` | Frequency | Hz | 100 | `#EC4899` |
| 11 | `PF` | Power Factor | — | 1000 | `#14B8A6` |

### DC Parameters (2)

| # | Key | Label | Unit | Divisor | Color |
|---|-----|-------|------|---------|-------|
| 12 | `DC_Power` | DC Power | kW | 1000 | `#FACC15` |
| 13 | `DC_Current` | DC Current | A | 1000 | `#FB923C` |

### Module Group 1 (String 1 & 2) — 6 parameters

| # | Key | Label | Unit | Divisor | Color |
|---|-----|-------|------|---------|-------|
| 14 | `ModGrp1_Mod1_Power` | M1 String 1 Power | W | 1 | `#60A5FA` |
| 15 | `ModGrp1_Mod1_Volt` | M1 String 1 Voltage | V | 1 | `#5EEAD4` |
| 16 | `ModGrp1_Mod1_Current` | M1 String 1 Current | A | 1000 | `#FDE047` |
| 17 | `ModGrp1_Mod2_Power` | M1 String 2 Power | W | 1 | `#F472B6` |
| 18 | `ModGrp1_Mod2_Volt` | M1 String 2 Voltage | V | 1 | `#A78BFA` |
| 19 | `ModGrp1_Mod2_Current` | M1 String 2 Current | A | 1000 | `#FB923C` |

### Module Group 2 (String 1 & 2) — 6 parameters

| # | Key | Label | Unit | Divisor | Color |
|---|-----|-------|------|---------|-------|
| 20 | `ModGrp2_Mod1_Power` | M2 String 1 Power | W | 1 | `#34D399` |
| 21 | `ModGrp2_Mod1_Volt` | M2 String 1 Voltage | V | 1 | `#22D3EE` |
| 22 | `ModGrp2_Mod1_Current` | M2 String 1 Current | A | 1000 | `#FACC15` |
| 23 | `ModGrp2_Mod2_Power` | M2 String 2 Power | W | 1 | `#818CF8` |
| 24 | `ModGrp2_Mod2_Volt` | M2 String 2 Voltage | V | 1 | `#FB923C` |
| 25 | `ModGrp2_Mod2_Current` | M2 String 2 Current | A | 1000 | `#EF4444` |

### Generation (2)

| # | Key | Label | Unit | Divisor | Color |
|---|-----|-------|------|---------|-------|
| 26 | `Daily_generation` | Daily Generation | kWh | 1000 | `#22C55E` |
| 27 | `Total_generation` | Total Generation | MWh | 1000000 | `#A78BFA` |

### How Raw Values Are Transformed

The SCADA API returns values multiplied by a scaling factor (the `V` field):
- **÷ 1000** for power (kW), current (A), and power factor
- **÷ 10** for voltage (V)
- **÷ 100** for frequency (Hz)
- **÷ 1,000,000** for total generation (MWh)
- **÷ 1** (no change) for module group voltages and powers

Example: If `AC_active_power.V = 3245000`, the display value is `3245000 / 1000 = 3245.00 kW`.

---

## 10. API Endpoints

### Frontend → Backend (internal)

| Frontend Function | HTTP Method | URL | Response | Called When |
|---|---|---|---|---|
| `fetchScadaData()` | GET | `/api/data` | Full cache JSON | Every 5 seconds by `App.jsx` |
| `refreshScadaData()` | GET | `/api/refresh` | `{"ok": true}` | Manual refresh button |

**`/api/data` response shape:**
```json
{
  "site": [{ "siteId": "HARTEK01", "siteName": "...", "latitude": "...", ... }],
  "inverter": [{ "inverterIndex": 1, "data": { "AC_active_power": { "Q": 0, "V": 3245000 }, ... } }],
  "mfm": [{ "mfmIndex": 1, "data": { "KW": { "Q": 0, "V": 1234000 }, ... } }],
  "performance": [{ "paramName": "PPRatio", "data": 76.7 }, ...],
  "weather": [{ "data": { "AmbientTemp": { "Q": 0, "V": 32.5 }, ... } }],
  "last_update": "2026-06-23T12:00:00",
  "error": null
}
```

### Backend → External SCADA API

| Order | Method | URL | Purpose | Cache Key |
|-------|--------|-----|---------|-----------|
| 1 | POST | `{BASE_URL}/api/auth/login` | Authenticate, get JWT token | `token` |
| 2 | GET | `{BASE_URL}/api/site/` | Site information | `site` |
| 3 | GET | `{BASE_URL}/api/inverter?siteId=HARTEK01` | Inverter real-time data | `inverter` |
| 4 | GET | `{BASE_URL}/api/mfm?siteId=HARTEK01` | Multi-function meter data | `mfm` |
| 5 | GET | `{BASE_URL}/api/performance?siteId=HARTEK01` | Performance metrics | `performance` |
| 6 | GET | `{BASE_URL}/api/weather?siteId=HARTEK01` | Weather station data | `weather` |

**Base URL:** `https://mbscada.com/hartek/server`

**SCADA credentials (hardcoded in `backend/app.py`):**
```python
CREDENTIALS = {'clientId': 'HARTEK', 'username': 'userHartek', 'password': 'Hartek@123'}
```

**Headers sent to SCADA API:**
```
Authorization: Bearer {jwt_token}
Origin: https://mbscada.com
```

---

## 11. Data Flow

### Polling Cycle

```
Every 30s (backend thread):
  ┌─ login() → POST JWT credentials → get token
  ├─ GET /api/site/                          ─┐
  ├─ GET /api/inverter?siteId=HARTEK01       │ Store in
  ├─ GET /api/mfm?siteId=HARTEK01            │ memory cache
  ├─ GET /api/performance?siteId=HARTEK01    │ with Lock
  └─ GET /api/weather?siteId=HARTEK01       ─┘
       │
Every 5s (frontend App.jsx useEffect):
  ┌─ fetchScadaData() → GET /api/data
  ├─ Returns cached JSON
  └─ setData(response) → triggers component re-render
       │
On re-render (each component reads from data prop):
  ├─ getSiteData(data)        → site info
  ├─ getInverterData(data)    → inverter array
  ├─ getMFMData(data)         → mfm array
  ├─ getWeatherData(data)     → weather object
  └─ getPerformanceData(data) → performance array
```

### Data Extraction Helpers (`api/index.js`)

| Function | Returns | Used By |
|----------|---------|---------|
| `getSiteData(data)` | `data?.site?.[0]` or `null` | PlantOverview, Header |
| `getInverterData(data)` | `data?.inverter` or `[]` | InverterAnalytics, InverterGraph, KPICards |
| `getMFMData(data)` | `data?.mfm` or `[]` | MFMSection, EnergyMeter |
| `getWeatherData(data)` | `data?.weather?.[0]?.data` or `null` | WeatherDashboard, KPICards |
| `getPerformanceData(data)` | `data?.performance` or `[]` | PerformanceAnalytics |
| `getPerformanceByParam(data, name)` | Single perf object or `null` | PerformanceGauge, KPICards, Weather |

---

## 12. Color Theme & Styling

### Palette

All styling is through inline JavaScript objects. There are zero CSS files.

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Page background | Very dark blue | `#0B1220` | Main page, inner containers |
| Card background | Dark navy | `#111827` | Cards, header, sidebar |
| Sidebar background | Darker navy | `#0F172A` | Sidebar |
| Borders | Slate | `#1E293B` | Card borders, dividers |
| Border light | Slate lighter | `#334155` | Input borders, button borders |
| Headings | White | `#F1F5F9` | Page titles, section headers |
| Body text | Light gray | `#E2E8F0` | Main content text |
| Secondary text | Muted gray | `#94A3B8` | Labels, secondary info |
| Muted text | Darker gray | `#64748B` | Subtle labels, units |
| Subtle text | Very dark gray | `#475569` | Footer, minor text |
| Primary accent | Sky blue | `#38BDF8` | Active nav, chart color, accents |
| Button blue | Blue | `#1D4ED8` | Sign in button, selected border |
| Online/Good | Green | `#22C55E` | Status badges, positive values |
| Offline/Error | Red | `#EF4444` | Status badges, errors, critical severity |
| Warning | Yellow | `#FACC15` | Warning severity, DC Power |


### Common Style Patterns

| Element | Border Radius | Padding |
|---------|--------------|---------|
| Page cards | 12px | 24px |
| Inner cards | 10px | 16px |
| Inputs/buttons | 8px | 12px 16px |
| Login card | 16px | 48px 40px |
| Badges | 8px-12px | 4px 14px |

### Font

**Inter** from Google Fonts, weights 300–800.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

Applied globally via `body` default (no CSS file — browser inherits from system or Inter).

---

## 13. Mock Data vs Live Data

Several components contain **hardcoded mock data** because the corresponding API endpoints are unavailable or would return 504 errors.

| Component | Mock Data | Notes |
|-----------|-----------|-------|
| `InverterAnalytics.jsx` | `chartData` array (11 time points) | "Today's Generation Trend" area chart uses this hardcoded data regardless of live values |
| `InverterGraph.jsx` | `mockTrend` array (12 hours) | Trend chart generates a sinusoidal curve based on the current live value — not real historical data |
| `Annunciator.jsx` | `mockAlarms` array (5 alarms) | No real alarm data — fully self-contained with search, filter, acknowledge toggles |
| `PerformanceAnalytics.jsx` | `monthlyData` array (6 months) | Monthly generation bar chart uses hardcoded Jan-Jun values |
| `Reports.jsx` | — | UI only; export buttons show "Feature coming soon" alert |
| `Settings.jsx` | — | UI only; no functional settings persistence |

**Live data from SCADA API:**
- Plant Overview (site info, lat/lng, status)
- Inverter real-time values (all 27 parameters)
- MFM electrical parameters (13 per meter)
- Performance metrics (PR, CUF, yields)
- Weather station (temperature, irradiance, wind, rainfall)

---

## 14. Production Build & Deployment

### Build the Frontend

```bash
cd frontend
npm run build
```

Produces `frontend/dist/` with:
- `index.html` (~0.5 kB)
- `assets/index-*.js` (~600 kB, gzipped ~170 kB)

### Running in Production

Flask serves the built frontend automatically:

```bash
python backend/app.py
```

All routes (`/`, `/dashboard`, `/inverters`, etc.) return `dist/index.html` via the SPA catch-all route. API routes (`/api/*`) work as normal.

### Deployment Options

1. **Single server**: Run Flask behind nginx/Caddy. Point the domain to port 5000 or use a reverse proxy.
2. **Separate servers**: Deploy `frontend/dist/` to any static host (Vercel, Netlify, S3). Ensure `/api/*` requests are proxied to the Flask backend.

### Important: API Base URL in Production

The frontend's `api/index.js` uses:

```js
const BASE = '/api'
```

In dev mode, Vite proxies `/api` → `http://localhost:5000`.
In production (served by Flask), `/api` → same origin → Flask handles it directly.

---

## 15. Troubleshooting

### Login page shows 404

**Cause:** Old build files without the login route.
**Fix:** Rebuild the frontend and restart Flask:
```bash
cd frontend && npm run build
# Then restart backend
```

### API data not loading

**Symptoms:** "Connection Error" banner, empty dashboard, all values show "--".

**Check:**
1. Is the SCADA API reachable? Test: `curl https://mbscada.com/hartek/server/api/auth/login`
2. Check the Flask console for errors (e.g., 504 Gateway Time-out)
3. The `/api/data` endpoint response — visit `http://localhost:5000/api/data` in browser

**Known issues:**
- `/api/site/all` returns 504 — the backend uses `/api/site/` instead (which works)
- The alarm endpoint `/api/alarm/filter/state` also returns 504 — Annunciator uses mock data

### Inverter chart shows mock trend data

The "Real-Time Trend" chart on the Inverters page generates a sinusoidal curve client-side. This is **not real historical data** — the SCADA API does not expose a time-series endpoint for individual inverter parameters in the current integration.

### Values look wrong (too large or too small)

Check the divisor in the parameter definitions:
- Power values from API are in milliwatts → divide by 1000 for kW
- Voltage values are in decivolts → divide by 10 for V
- Frequency values are in centihertz → divide by 100 for Hz
- Total generation is in watt-hours → divide by 1,000,000 for MWh

### Port 5000 already in use

```bash
# Find the process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
# Or use a different port
# Edit backend/app.py: app.run(host='0.0.0.0', port=5001)
```

### SCADA login fails

The backend logs into the SCADA API with hardcoded credentials. If the password changes:
1. Update `CREDENTIALS` in `backend/app.py` line 16
2. Restart the Flask server
3. The frontend Settings page also displays these values as reference

### Frontend build errors

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## Quick Reference

**Start the app:**
```bash
python backend/app.py
# Open http://localhost:5000
```

**Rebuild frontend after changes:**
```bash
cd frontend && npm run build
```

**Login:** `admin` / `admin123` or `userHartek` / `Hartek@123`

**Data refresh:** Manual via ⟳ button in header. Auto every 5s frontend, 30s backend.

**Key files:**
| File | Lines | Purpose |
|------|-------|---------|
| `backend/app.py` | 128 | Flask API proxy + cache |
| `frontend/src/App.jsx` | 87 | Root: routing + auth + polling |
| `frontend/src/AuthContext.jsx` | 43 | Login/logout state |
| `frontend/src/components/Header.jsx` | 123 | Top bar with logo + user menu |
| `frontend/src/components/InverterGraph.jsx` | 202 | 27-parameter detail view |
| `frontend/src/pages/Login.jsx` | 115 | Login form |
| `frontend/src/pages/Dashboard.jsx` | 52 | Dashboard composition |
| `frontend/src/pages/Annunciator.jsx` | 129 | Alarm table (mock) |

---

*Document generated June 2026. Project: Hartek 5 MW Solar SCADA Dashboard by M.B. Control & Systems Pvt. Ltd.*
