# CFL Meme Adapter (dev-only)

Dev-only helper that lets you hit the Porchroot Auto generators (wizard backgrounds and quote memes) through a small FastAPI app. Lives outside the Jekyll site so it won't affect builds.

## Prereqs
- Python 3.10+ with `pip`
- Porchroot Auto checked out locally (default path: `../_personal_sandbox_CJT01/projects/porchroot-auto`; override with `PORCHROOT_AUTO_DIR`)
- Env: `GEMINI_API_KEY` (required), optional `BRAND_HANDLE`, `BRAND_WEBSITE`
- Install deps: `python -m venv .venv && source .venv/bin/activate && pip install -r dev_tools/meme_generator/requirements.txt`
- Also install the Porchroot deps in that repo (`pip install -r requirements.txt`) so Pillow/GenAI are available.

## Run the API
```
uvicorn dev_tools.meme_generator.adapter:app --reload --port 8001
```

Endpoints (JSON):
- `POST /wizard/backgrounds` with `{"count": 3}` to generate that many pixel-art backgrounds via `generate_wizard_memes.py`. Saves into Porchroot's `assets/wizard_memes`.
- `POST /wizard/quotes` with `{"count": 3}` to generate quote memes with baked-in text via `generate_wizard_quote_images.py`. Saves into Porchroot's `output/wizard_quotes`.
- `GET /health` to verify the adapter can see the Porchroot path.

Example call:
```
curl -X POST http://127.0.0.1:8001/wizard/backgrounds \
  -H "Content-Type: application/json" \
  -d '{"count":2}'
```

## How it works
- Dynamically loads Porchroot Auto scripts from `PORCHROOT_AUTO_DIR` without copying them.
- Respects all their env usage (Gemini keys, brand handle, etc.).
- Lives under `dev_tools/` so it stays opt-in and out of the main site pipeline.

## Notes
- If you also want Pillow-rendered posts/captions (`factory.py`), make sure `api-testing-framework` is present next to Porchroot Auto so its `GeminiClient` import works. The current API endpoints avoid that dependency.
- Gemini rate limits/exceptions bubble up; check the terminal logs for details.
