# 🚀 TokenTrack — AI Token Analytics Platform

A full-stack final-year project for tracking, optimizing, and forecasting AI token consumption across multiple providers.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Multi-Provider Support** | Real API calls to Groq, OpenAI, Anthropic, and Google Gemini |
| **Prompt Optimization** | Auto-generated efficiency suggestions after every request |
| **Budget Alerts** | Set a monthly budget — get warned at 80% / 90% / 100% usage (email or console) |
| **Token Forecasting** | Predicts month-end spend based on current daily average |
| **Export Reports** | Download usage history as CSV or PDF |
| **Dark / Light Theme** | Toggle instantly, persists per-user in the database |
| **API Keys Page** | Store your own provider keys securely, masked in the UI |
| **Compare Models** | Run the same prompt across all models, see cost/speed/token winner |
| **Cost Calculator** | Interactive sliders to estimate monthly spend per provider |

---

## 🛠️ Tech Stack

```
Frontend  → React 19 + Vite + Tailwind CSS v4 + Recharts + React Router
Backend   → Node.js + Express.js
Database  → MongoDB + Mongoose
Auth      → JWT (7-day tokens) + bcryptjs
AI SDKs   → groq-sdk, openai, @anthropic-ai/sdk, @google/generative-ai
Export    → jsPDF + jspdf-autotable
Email     → nodemailer (falls back to console log if SMTP not configured)
```

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env     # edit JWT_SECRET, optionally SMTP creds
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** → Register → go to **Settings** → add your API keys.

---

## 🔑 Getting API Keys (all have free tiers except OpenAI)

| Provider | Free tier | Get key |
|---|---|---|
| Groq | ✅ Yes, generous | console.groq.com |
| Google Gemini | ✅ Yes | aistudio.google.com/apikey |
| Anthropic | ❌ Paid only | console.anthropic.com |
| OpenAI | ❌ Paid only | platform.openai.com/api-keys |

You only need **one** key (Groq is recommended) to start using the app — add more anytime in Settings.

---

## 📁 Project Structure

```
tokentrack/
├── backend/
│   ├── models/
│   │   ├── User.js          # auth + theme + budget + API keys + alert flags
│   │   └── Request.js       # per-request token/cost/suggestions log
│   ├── routes/
│   │   ├── auth.js          # register, login, me
│   │   ├── requests.js      # multi-provider request + budget check trigger
│   │   ├── stats.js         # dashboard aggregations + forecast + export
│   │   └── settings.js      # theme, budget, API keys CRUD
│   ├── utils/
│   │   ├── providers.js     # Groq/OpenAI/Anthropic/Gemini call abstraction
│   │   ├── efficiency.js    # grading + suggestion generator
│   │   └── mailer.js        # budget alert emails (console fallback)
│   ├── middleware/auth.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/Layout.jsx     # navbar + theme toggle + settings link
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx      # dark/light CSS variable swap
        ├── pages/
        │   ├── DashboardPage.jsx     # + forecast card + budget bar + export
        │   ├── NewRequestPage.jsx    # + multi-provider picker + suggestions
        │   ├── HistoryPage.jsx
        │   ├── ComparePage.jsx
        │   ├── CalculatorPage.jsx
        │   └── SettingsPage.jsx      # NEW — API keys, budget, theme
        └── utils/
            ├── api.js
            ├── tokens.js             # all 7 models across 4 providers
            └── export.js             # NEW — CSV + PDF generation
```

---

## 💡 Architecture Notes for Your Report

- **Provider abstraction layer** (`utils/providers.js`) — single interface, each provider's SDK normalized to `{ text, inputTokens, outputTokens }`. Adding a 5th provider = one new function + one PRICING entry.
- **Forecast algorithm** — simple linear projection: `dailyAvg = monthSpend / daysElapsed`, then `forecastedSpend = dailyAvg * daysInMonth`. Documented as a stated assumption (usage pattern stays constant).
- **Budget alerts** — idempotent via stored flags (`budgetAlertsSent.at80/90/100`) that reset on month change, so each threshold only fires once.
- **Suggestion engine** — rule-based (duplicate sentence detection, length heuristics, filler-phrase matching) rather than an LLM call, keeping it free and instant.

---


