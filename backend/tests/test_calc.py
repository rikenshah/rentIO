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
    # Expected values based on real calculation
    assert abs(result["monthly_payment"] - 1516.96) < 0.1
    assert abs(result["NOI"] - 17100.0) < 0.1
    assert abs(result["CapRate"] - 5.7) < 0.1
    assert abs(result["CashFlow"] + 1103.56) < 0.1  # negative cash flow
    assert abs(result["CashOnCash"] + 1.84) < 0.1   # negative cash on cash
    assert abs(result["StockValue"] - 129535.5) < 1
    assert abs(result["NPV"] - 18248.17) < 0.1
    assert abs(result["IRR"] - 10.49) < 0.1
