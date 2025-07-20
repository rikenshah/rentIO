"""Utility to generate advice using a lightweight local LLM with optional OpenAI fallback."""

from __future__ import annotations

import os
from typing import Any

try:
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
except Exception:  # pragma: no cover - transformers may not be installed during tests
    AutoModelForSeq2SeqLM = None  # type: ignore
    AutoTokenizer = None  # type: ignore
    pipeline = None  # type: ignore

import openai

_local_pipe = None


def _load_local_model(model_name: str):
    """Load a small transformers model for CPU inference."""
    global _local_pipe
    if _local_pipe is None:
        if AutoModelForSeq2SeqLM is None:
            raise RuntimeError("Transformers not installed")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        _local_pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer)
    return _local_pipe


def get_llm_response(scenario: Any, question: str) -> str:
    """Return an advice string for the given scenario and user question."""
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        openai.api_key = api_key
        prompt = (
            "You are a financial advisor. Here is a real estate vs. stock scenario:\n"
            f"Scenario: {scenario}\n"
            f"User question: {question}\n"
            "Provide a clear, concise answer with reasoning."
        )
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message["content"]

    # Use local model
    model_name = os.getenv("LOCAL_LLM_MODEL", "google/flan-t5-small")
    pipe = _load_local_model(model_name)
    prompt = (
        "You are a financial advisor. "
        f"Scenario: {scenario}. "
        f"Question: {question}. "
        "Answer in a short and helpful way."
    )
    result = pipe(prompt, max_new_tokens=128)[0]["generated_text"]
    return result.strip()
