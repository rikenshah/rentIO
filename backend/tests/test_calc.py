import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.main import ScenarioInput
from app.calc import calculate_metrics

def sample_scenario(**overrides) -> ScenarioInput:
    base = dict(
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
    base.update(overrides)
    return ScenarioInput(**base)

def test_calc_typical_loss():
    scenario = sample_scenario()
    result = calculate_metrics(scenario)
    # NOI is positive, but cash flow should be negative
    assert result["NOI"] > 0
    assert result["CashFlow"] < 0
    # NPV can be positive if appreciation/sale is large enough
    # IRR should not be negative
    assert result["IRR"] >= 0

def test_calc_profitable():
    scenario = sample_scenario(rent=3500)
    result = calculate_metrics(scenario)
    assert result["NOI"] > 0
    assert result["CashFlow"] > 0
    assert result["NPV"] > 0
    assert result["IRR"] > 0

def test_calc_break_even():
    scenario = sample_scenario(rent=2500)
    result = calculate_metrics(scenario)
    assert abs(result["CashFlow"]) < 5000  # close to break-even

def test_calc_zero_rent():
    scenario = sample_scenario(rent=0)
    result = calculate_metrics(scenario)
    assert result["NOI"] < 0
    assert result["CashFlow"] < 0
    assert result["NPV"] < 0
    assert result["IRR"] <= 0

def test_calc_high_expenses():
    scenario = sample_scenario(property_tax=10000, insurance=5000, maintenance=8000)
    result = calculate_metrics(scenario)
    assert result["NOI"] < 0
    assert result["CashFlow"] < 0

def test_calc_high_occupancy():
    scenario = sample_scenario(vacancy_rate=0)
    result = calculate_metrics(scenario)
    assert result["NOI"] > 0

def test_calc_high_vacancy():
    base_result = calculate_metrics(sample_scenario())
    scenario = sample_scenario(vacancy_rate=50)
    result = calculate_metrics(scenario)
    # NOI may still be positive if rent is high enough, but should be much lower
    assert result["NOI"] < base_result["NOI"]

def test_calc_high_stock_return():
    scenario = sample_scenario(stock_return_rate=20)
    result = calculate_metrics(scenario)
    assert result["StockValue"] > 0
    assert result["NPV"] < 0  # NPV should be lower due to high discount rate
