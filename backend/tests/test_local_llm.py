import sys
from pathlib import Path
from fastapi.testclient import TestClient
import types

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.main import app
from app import local_llm

client = TestClient(app)


def test_get_local_llm_response_mock(monkeypatch):
    class DummyLLM:
        def generate(self, prompt, max_tokens=256):
            assert "Scenario" in prompt
            return "dummy answer"

    monkeypatch.setattr(local_llm, "get_local_llm", lambda model_dir=None: DummyLLM())
    resp = local_llm.get_local_llm_response({}, "What is ROI?")
    assert "dummy answer" in resp


def test_local_llm_endpoint(monkeypatch):
    monkeypatch.setattr(local_llm, "get_local_llm_response", lambda s, q: "dummy")
    import app.main as main_module
    monkeypatch.setattr(main_module, "get_local_llm_response", lambda s, q: "dummy")
    scenario = {
        "purchase_price": 1,
        "down_payment": 1,
        "loan_amount": 0,
        "interest_rate": 0,
        "loan_years": 1,
        "property_tax": 0,
        "insurance": 0,
        "maintenance": 0,
        "vacancy_rate": 0,
        "rent": 0,
        "appreciation_rate": 0,
        "stock_return_rate": 0,
        "years": 1,
    }
    resp = client.post("/local_llm", json={"scenario": scenario, "question": "hi"})
    assert resp.status_code == 200
    assert resp.json()["response"] == "dummy"
