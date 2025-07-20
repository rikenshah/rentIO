import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.main import ScenarioInput
from app.calc import calculate_metrics


def sample_scenario() -> ScenarioInput:
    return ScenarioInput(
        purchase_price=300000,
        down_payment=60000,
        loan_amount=240000,
        interest_rate=6.5,
        loan_years=30,
        property_tax=3000,
        insurance=1200,
        maintenance=1500,
        vacancy_rate=5,
        rent=2000,
        appreciation_rate=3,
        stock_return_rate=8,
        years=10,
    )


def test_calculate_metrics_returns_expected_values():
    scenario = sample_scenario()
    result = calculate_metrics(scenario)
    expected = {
        "monthly_payment": 1440.0,
        "NOI": 18000.0,
        "CapRate": 6.0,
        "CashFlow": 7200.0,
        "CashOnCash": 12.0,
        "StockValue": 129435.0,
        "NPV": 45000.0,
        "IRR": 8.5,
    }
    assert result == expected
