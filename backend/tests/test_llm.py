import os
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.llm import get_llm_response


def test_get_llm_response_without_api_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    result = get_llm_response({}, "What is up?")
    assert "OpenAI API key not set" in result
