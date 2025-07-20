import os
import sys
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.main import app

client = TestClient(app)

base_scenario = {
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


def test_calculate_returns_varying_values():
    resp1 = client.post("/calculate", json=base_scenario)
    assert resp1.status_code == 200
    data1 = resp1.json()
    # change rent to ensure output differs
    scenario2 = base_scenario.copy()
    scenario2["rent"] = 2500
    resp2 = client.post("/calculate", json=scenario2)
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data1 != data2
    assert data2["NOI"] > data1["NOI"]


def test_monthly_payment_calculation():
    resp = client.post("/calculate", json=base_scenario)
    assert resp.status_code == 200
    data = resp.json()
    monthly_rate = base_scenario["interest_rate"] / 100 / 12
    payments = base_scenario["loan_years"] * 12
    expected_payment = base_scenario["loan_amount"] * (
        monthly_rate * (1 + monthly_rate) ** payments
    ) / ((1 + monthly_rate) ** payments - 1)
    assert abs(data["monthly_payment"] - expected_payment) < 0.01


