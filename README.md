# MacroFX Terminal

> Institutional macro swing trading dashboard — matches QuantTERMINAL_OS design system

## Features

- **Currency Strength Heatmap** — 8 currencies × 15+ macro factors, color-coded like TradeSavePlus but with institutional depth
- **Macro Signal Engine** — CMSI (Currency Macro Strength Index) composite scoring per currency
- **Signal Dashboard** — Long/Short pair signals with confidence, entry/exit levels, expected holding period
- **Interest Rate Matrix** — Live central bank rate comparison with trend arrows
- **Economic Calendar** — Upcoming high-impact events with expected currency impact pre-loaded
- **Pair Detail View** — Deep factor breakdown chart per currency pair
- **Config / API Tab** — API key management matching soft-quant-news / QuantTERMINAL_OS pattern

## Free APIs Used

| API | Data | Signup |
|-----|------|--------|
| `api.frankfurter.app` | Live FX rates | None |
| `fred.stlouisfed.org` | US CPI, rates, GDP, unemployment | Free account |
| `alphavantage.co` | FX OHLCV + macro indicators | Free account |
| `api.fiscaldata.treasury.gov` | US Treasury yields | None |

## Stack

- Vanilla HTML/CSS/JS — no build step required
- Electron-compatible (same architecture as QuantTERMINAL_OS / amm-bot)
- Chart.js for macro visualizations
- Lightweight Charts for FX price panels

## Setup

```bash
npm install
npm start          # Electron desktop app
# OR open frontend/index.html directly in browser
```

## Design System

Matches QuantTERMINAL_OS exactly:
- `#0a0a14` background, `#1a1a2e` surface, `#7aa2f7` accent
- Inter font, 180px collapsible sidebar, panel headers uppercase 9px
- `border-left: 3px solid #7aa2f7` active nav state
