import os
from functools import lru_cache
from typing import Any, Mapping

from llama_cpp import Llama


@lru_cache(maxsize=1)
def _load_model() -> Llama:
    """Load the local Llama model from ``LOCAL_LLM_MODEL_PATH``."""
    model_path = os.getenv("LOCAL_LLM_MODEL_PATH")
    if not model_path:
        raise RuntimeError("LOCAL_LLM_MODEL_PATH environment variable not set")
    n_threads = int(os.getenv("LLAMA_THREADS", "4"))
    return Llama(model_path=model_path, n_ctx=2048, n_threads=n_threads)


def get_chat_response(scenario: Mapping[str, Any], question: str) -> str:
    """Generate a chat style response using the local LLM.

    Parameters
    ----------
    scenario: Mapping[str, Any]
        Scenario inputs describing the investment.
    question: str
        Arbitrary user question about the scenario.

    Returns
    -------
    str
        The assistant's response or an error message if the model
        is unavailable.
    """
    try:
        llm = _load_model()
    except Exception as exc:  # pragma: no cover - simple error path
        return f"Local LLM not available: {exc}"  # keep short for API

    prompt = (
        "You are a helpful financial assistant. "
        f"Here is a real estate scenario: {scenario}. "
        f"Question: {question}\nAnswer in a concise paragraph."
    )

    result = llm.create_chat_completion(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=256,
    )
    return result["choices"][0]["message"]["content"].strip()
