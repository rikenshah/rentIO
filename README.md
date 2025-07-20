# rentIO

A monorepo for a React and FastAPI application that compares real estate investments with stock market returns. The goal is to let users model rental property scenarios and see how they stack up against a simple stock portfolio over time.

## Features

- **Interactive calculators** for metrics such as Net Operating Income, Cap Rate, Cash Flow, Cash-on-Cash Return, Internal Rate of Return (IRR), and Net Present Value (NPV).
- **Scenario comparisons** allowing users to adjust inputs like purchase price, mortgage terms, vacancy rate and more, then view both real estate and stock performance side by side.
- **LLM integration** for answering "what‑if" questions using a lightweight local model with optional OpenAI fallback.
- **Chat assistant** lets you ask follow-up questions like "What if appreciation drops 2%?" and receive plain‑language advice.
- **React frontend** with live updates and charting.
- **FastAPI backend** providing calculation endpoints and optional machine‑learning forecasts.

## Repository Structure

```
backend/
  app/
    calc.py        # financial calculations (currently mock values)
    llm.py         # local LLM helper with optional OpenAI fallback
    main.py        # FastAPI routes
    models.py      # placeholder for future data models
  requirements.txt
frontend/
  src/             # React components and pages
  public/
  package.json
instructions.md    # full design spec and setup instructions
``` 

## Local Development

Requirements:

- Node.js 18+
- Python 3.10+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will use a small local LLM by default (`google/flan-t5-small`).
To use a different model or the OpenAI API, set these environment variables:

```bash
# optional: override the local model
export LOCAL_LLM_MODEL="google/flan-t5-small"
# optional: use OpenAI instead of the local model
export OPENAI_API_KEY=your-key
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
The frontend starts on [http://localhost:5173](http://localhost:5173). If you change the API URL, update `.env` accordingly.

### Combined Dev Script

At the repo root you can run:

```bash
npm run dev
```

This runs the backend and frontend concurrently for easy development.

## Project Status

This project is in the early stages. Calculation modules currently return placeholder values until real formulas and forecasting models are implemented. See `instructions.md` for the planned phases including ML-driven rent and appreciation forecasts, scenario comparison UI, and potential Docker deployment.

## License

This repository is released under the terms of the MIT License.
