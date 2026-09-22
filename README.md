# interbridge

Tells a business which provincial regulations block them from expanding, in plain
language, plus a compliance checklist. Built for AF Hacks: Growing Canada (24-hour
hackathon).

**This is a demo, not legal advice.**

## Scope

Covers exactly 4 provinces (Ontario, Quebec, British Columbia, Alberta) and 3 product
categories (packaged food, alcohol, cosmetics), backed by 57 hand-curated regulation
entries sourced from real provincial government sites — see `backend/app/data/seed/`.
No live scraping, no invented regulations: the Claude API layer only explains and
formats from this curated data, grounded via the prompt in `backend/app/services/matcher.py`.

Hero demo: **packaged bakery goods expanding to Quebec** — reliably returns a rich
"blocked" result (French labelling under the Charter of the French Language, MAPAQ
permits, food safety training, QST registration).

## Running it

### Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your ANTHROPIC_API_KEY (optional — falls back to a
                        # deterministic explanation built straight from seed data
                        # if no key is set, so the demo never breaks)
uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000. The frontend expects the backend at
`http://localhost:8000` (see `frontend/.env.local`).

## API

- `GET /api/provinces`, `GET /api/categories` — metadata
- `POST /api/check` — `{ business_description, provinces: ["ON","QC","BC","AB"], daily_revenue? }`
  → `{ matched_category, results: [{ province_name, status: "blocked"|"clear", blocked, explanation, checklist, estimated_delay_days, cost_of_delay }] }`
