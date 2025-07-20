import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.local_llm import get_chat_response


def test_get_chat_response_without_model(monkeypatch):
    monkeypatch.delenv("LOCAL_LLM_MODEL_PATH", raising=False)
    resp = get_chat_response({}, "Hi")
    assert "Local LLM not available" in resp
