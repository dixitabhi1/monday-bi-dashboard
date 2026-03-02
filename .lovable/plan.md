

# Monday BI Agent — Frontend Implementation Plan

## Architecture Overview
A polished, enterprise-grade React frontend with three main sections (Dashboard, Analytics, Assistant) powered by a live backend API. A Supabase Edge Function serves as the `/api/chat` proxy to avoid exposing the Hugging Face backend URL directly from the browser.

---

## 1. Landing Page
- Clean hero section with "Monday BI Agent" title and subtitle: "Founder-level BI assistant over live monday.com data"
- Primary CTA button: **"Enter Dashboard"** → navigates to main app
- Secondary CTA: **"Open API Docs"** → opens Swagger URL in new tab
- Enterprise-style neutral color palette, strong typography

## 2. Proxy Layer (Supabase Edge Function)
- Create `supabase/functions/chat` Edge Function
- Forwards `{ query }` body to `https://abhishek785-monday-bi-agent.hf.space/chat`
- Passes through `x-deals-board-id` and `x-work-orders-board-id` headers if present
- 30-second timeout with 1 automatic retry on failure
- Returns clear error messages on timeout or backend errors

## 3. Main App Shell
- Top navigation with three tabs: **Dashboard** (default), **Analytics**, **Assistant**
- Floating chat icon (bottom-right) that opens the Assistant as a slide-out drawer
- Responsive layout for desktop and mobile

## 4. Dashboard Page (Default Tab)
- **KPI Cards Grid** — 7 cards displaying:
  - Total Pipeline Value, Average Deal Size, Top Sector + Concentration %, Realized Revenue, Delay %, 90-Day Forecast Revenue, 90-Day Forecast Deals
- **Insight Panel** — displays the `summary` text from the API response
- **Caveats Panel** — lists all `caveats` items with appropriate warning styling
- **Technical Meta Row** — compact footer showing `request_id`, `latency_ms`, `timestamp_utc`, `intent`, and `tenant_context` board IDs
- On initial load, sends a default query (e.g., "Give me a full pipeline overview") to populate data
- Loading skeletons while data loads; friendly error banners on failure

## 5. Analytics Page
- Three chart panels using Recharts (already installed):
  - **Revenue by Sector** — horizontal or vertical bar chart
  - **Deal Count by Stage** — bar chart with optional pie chart toggle
  - **Work Order Status Distribution** — bar chart with optional pie chart toggle
- Graceful empty states when chart data is missing or empty
- Data sourced from the same API response used on the Dashboard

## 6. Assistant Panel (Chat Interface)
- Slide-out drawer triggered by floating chat icon (also accessible via Assistant tab)
- **Chat history** — session-level persistence (stored in React state, survives tab switches)
- **Suggested query chips** — pre-built prompts like "Pipeline overview", "Top sectors", "Deal delays", "90-day forecast"
- **Expandable trace viewer** — collapsible section showing `trace` array for each response
- **Copy response** button per message
- **Export latest response** as downloadable text file
- **Clear chat** button to reset conversation
- Markdown rendering for AI responses

## 7. State Management & Reliability
- Last successful API response preserved in state — displayed even if next request fails
- Loading skeletons on all data-dependent components
- Error banners with retry option
- All data flows through the Supabase Edge Function proxy (no direct HF calls from browser)

## 8. Design System
- Neutral, enterprise color palette (keeping the existing shadcn/ui theme with minor refinements)
- Clean card-based layouts with good spacing
- Strong typography hierarchy (clear headings, readable body text)
- Accessible focus rings and keyboard navigation
- Fully responsive: desktop grid → mobile stack

## 9. README Documentation
- Section explaining the Supabase Edge Function proxy setup
- Environment configuration details
- How to set custom board IDs via headers

