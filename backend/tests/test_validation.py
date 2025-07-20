import pytest
from app.main import ScenarioInput


def test_down_payment_cannot_exceed_price():
    with pytest.raises(ValueError):
        ScenarioInput(
            purchase_price=100000,
            down_payment=120000,
            loan_amount=0,
            interest_rate=5,
            loan_years=30,
            property_tax=1000,
            insurance=1000,
            maintenance=500,
            vacancy_rate=5,
            rent=1500,
            appreciation_rate=3,
            stock_return_rate=8,
            years=5,
        )


def test_loan_amount_must_match():
    with pytest.raises(ValueError):
        ScenarioInput(
            purchase_price=100000,
            down_payment=20000,
            loan_amount=70000,
            interest_rate=5,
            loan_years=30,
            property_tax=1000,
            insurance=1000,
            maintenance=500,
            vacancy_rate=5,
            rent=1500,
            appreciation_rate=3,
            stock_return_rate=8,
            years=5,
        )


def test_vacancy_rate_range():
    with pytest.raises(ValueError):
        ScenarioInput(
            purchase_price=100000,
            down_payment=20000,
            loan_amount=80000,
            interest_rate=5,
            loan_years=30,
            property_tax=1000,
            insurance=1000,
            maintenance=500,
            vacancy_rate=-1,
            rent=1500,
            appreciation_rate=3,
            stock_return_rate=8,
            years=5,
        )
    with pytest.raises(ValueError):
        ScenarioInput(
            purchase_price=100000,
            down_payment=20000,
            loan_amount=80000,
            interest_rate=5,
            loan_years=30,
            property_tax=1000,
            insurance=1000,
            maintenance=500,
            vacancy_rate=101,
            rent=1500,
            appreciation_rate=3,
            stock_return_rate=8,
            years=5,
        )
