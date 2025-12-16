"""
FastAPI adapter that exposes Porchroot Auto meme generators as simple endpoints.
Dev-only; lives outside the Jekyll site and dynamically loads scripts from
the Porchroot Auto repo so we don't duplicate code here.
"""

from __future__ import annotations

import importlib.util
import os
import random
import sys
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Default location of the Porchroot Auto repo; override with PORCHROOT_AUTO_DIR
DEFAULT_PORCHROOT_DIR = (
    Path(os.getenv("PORCHROOT_AUTO_DIR"))
    if os.getenv("PORCHROOT_AUTO_DIR")
    else Path(__file__).resolve().parents[2]
    / "_personal_sandbox_CJT01"
    / "projects"
    / "porchroot-auto"
)


def resolve_porchroot_dir() -> Path:
    """Locate the Porchroot Auto repo."""
    root = (
        Path(os.getenv("PORCHROOT_AUTO_DIR"))
        if os.getenv("PORCHROOT_AUTO_DIR")
        else DEFAULT_PORCHROOT_DIR
    )
    if not root.exists():
        raise FileNotFoundError(
            f"Porchroot Auto repo not found at {root}. "
            "Set PORCHROOT_AUTO_DIR to point to it."
        )
    return root


def load_script(script_name: str):
    """Load a standalone Porchroot script by filename (without .py)."""
    root = resolve_porchroot_dir()
    script_path = root / f"{script_name}.py"
    if not script_path.exists():
        raise FileNotFoundError(f"Script missing: {script_path}")

    spec = importlib.util.spec_from_file_location(script_name, script_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not import {script_path}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[script_name] = module
    spec.loader.exec_module(module)
    return module


def clamp_requested(requested: Optional[int], max_len: int, fallback: int) -> int:
    """Clamp a requested count to 0..max_len with a sensible fallback."""
    if requested is None:
        return min(fallback, max_len)
    return max(0, min(requested, max_len))


app = FastAPI(
    title="CFL Meme Adapter",
    version="0.1.0",
    description=(
        "Dev-only adapter that wraps Porchroot Auto generators. "
        "Requires GEMINI_API_KEY and access to the Porchroot Auto repo."
    ),
)


class BackgroundRequest(BaseModel):
    count: Optional[int] = None


class QuoteRequest(BaseModel):
    count: Optional[int] = None


@app.get("/health")
def health():
    """Basic health check to verify we can see the Porchroot repo."""
    try:
        root = resolve_porchroot_dir()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"status": "ok", "porchroot_dir": str(root)}


@app.post("/wizard/backgrounds")
def generate_wizard_backgrounds(body: BackgroundRequest):
    """Generate wizard backgrounds via generate_wizard_memes.py."""
    try:
        mod = load_script("generate_wizard_memes")
    except (FileNotFoundError, ImportError) as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    prompts = list(getattr(mod, "PROMPTS", []))
    total_prompts = len(prompts)
    if total_prompts == 0:
        raise HTTPException(
            status_code=500,
            detail="generate_wizard_memes.py has no PROMPTS defined.",
        )

    count = clamp_requested(body.count, total_prompts, total_prompts)
    if count == 0:
        raise HTTPException(
            status_code=400, detail="Requested zero prompts; nothing to generate."
        )

    prompts = prompts[:count]

    generated = 0
    files: List[str] = []
    for idx, prompt in enumerate(prompts, 1):
        output_path = mod.OUTPUT_DIR / f"wizard_bg_{idx:02d}.png"
        if mod.generate_wizard_background(prompt, output_path, idx):
            generated += 1
            files.append(str(output_path))

    return {
        "requested": count,
        "generated": generated,
        "output_dir": str(mod.OUTPUT_DIR),
        "files": files,
    }


@app.post("/wizard/quotes")
def generate_wizard_quotes(body: QuoteRequest):
    """Generate baked-in quote memes via generate_wizard_quote_images.py."""
    try:
        mod = load_script("generate_wizard_quote_images")
    except (FileNotFoundError, ImportError) as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    try:
        quotes = mod.load_quotes()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Failed to load quotes: {exc}"
        ) from exc

    if not quotes:
        raise HTTPException(status_code=500, detail="No quotes available to use.")

    total_quotes = len(quotes)
    requested = body.count if body.count is not None else min(5, total_quotes)
    count = clamp_requested(requested, total_quotes, requested)
    if count == 0:
        raise HTTPException(status_code=400, detail="Requested zero quotes.")

    selected = random.sample(quotes, count)

    generated = 0
    files: List[str] = []
    for idx, quote in enumerate(selected, 1):
        scene = random.choice(getattr(mod, "SCENE_TEMPLATES", ["Wizard scene"]))
        if mod.generate_wizard_quote(quote, scene, idx):
            image_path = mod.OUTPUT_DIR / f"wizard_quote_{quote['id']:03d}.png"
            files.append(str(image_path))
            generated += 1

    return {
        "requested": count,
        "generated": generated,
        "output_dir": str(mod.OUTPUT_DIR),
        "files": files,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "dev_tools.meme_generator.adapter:app",
        host="127.0.0.1",
        port=8001,
        reload=True,
    )
