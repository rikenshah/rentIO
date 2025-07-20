from fastapi.testclient import TestClient
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.main import app

client = TestClient(app)


def sample_scenario():
    return {
        "purchase_price": 300000,
        "down_payment": 60000,
        "loan_amount": 240000,
        "interest_rate": 6.5,
        "loan_years": 30,
        "property_tax": 3000,
        "insurance": 1200,
        "maintenance": 1500,
        "vacancy_rate": 5,
        "rent": 2000,
        "appreciation_rate": 3,
        "stock_return_rate": 8,
        "years": 10,
    }


def test_health_endpoint():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_calculate_endpoint():
    resp = client.post("/calculate", json=sample_scenario())
    assert resp.status_code == 200
    data = resp.json()
    assert data["IRR"] == 0
    assert "NOI" in data


def test_llm_endpoint_without_api_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    resp = client.post("/llm", json={"scenario": sample_scenario(), "question": "Hello"})
    assert resp.status_code == 200
    assert "OpenAI API key not set" in resp.json()["response"]
