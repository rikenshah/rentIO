"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any, Dict
import numpy as np


def _monthly_mortgage_payment(loan_amount: float, annual_rate: float, years: int) -> float:
    """Calculate monthly mortgage payment using the standard formula."""
    r = annual_rate / 100 / 12
    n = years * 12
    if r == 0:
        return loan_amount / n
    return loan_amount * (r * (1 + r) ** n) / ((1 + r) ** n - 1)


def _irr(cash_flows):
    """Compute internal rate of return, falling back to numpy if needed."""
    try:
        import numpy_financial as npf  # type: ignore
        return float(npf.irr(cash_flows)) * 100
    except Exception:
        return float(np.irr(cash_flows)) * 100


def calculate_metrics(scenario: Mapping[str, Any]) -> Dict[str, float]:
    """Calculate various investment metrics from an input scenario."""
    try:
        p = scenario.dict() if hasattr(scenario, 'dict') else scenario

        loan_amount = float(p['loan_amount'])
        years = int(p['loan_years'])
        interest = float(p['interest_rate'])
        monthly_payment = _monthly_mortgage_payment(loan_amount, interest, years)
        annual_debt_service = monthly_payment * 12

        gross_income = float(p['rent']) * 12
        vacancy_loss = gross_income * (float(p['vacancy_rate']) / 100)
        operating_expenses = float(p['property_tax']) + float(p['insurance']) + float(p['maintenance'])
        noi = gross_income - vacancy_loss - operating_expenses

        cap_rate = (noi / float(p['purchase_price'])) * 100 if float(p['purchase_price']) else 0

        cash_flow = noi - annual_debt_service
        cash_on_cash = (cash_flow / float(p['down_payment'])) * 100 if float(p['down_payment']) else 0

        stock_value = float(p['down_payment']) * (1 + float(p['stock_return_rate']) / 100) ** int(p['years'])

        discount_rate = float(p['stock_return_rate']) / 100
        npv = -float(p['down_payment']) + sum(
            cash_flow / ((1 + discount_rate) ** (i + 1)) for i in range(int(p['years']))
        )

        if cash_flow > 0 and float(p['down_payment']) > 0:
            cash_flows = [-float(p['down_payment'])] + [cash_flow] * int(p['years'])
            irr = _irr(cash_flows)
        else:
            irr = 0

        dscr = noi / annual_debt_service if annual_debt_service else 0

        return {
            'monthly_payment': monthly_payment,
            'NOI': noi,
            'CapRate': cap_rate,
            'CashFlow': cash_flow,
            'CashOnCash': cash_on_cash,
            'StockValue': stock_value,
            'NPV': npv,
            'IRR': irr,
            'DSCR': dscr,
        }
    except Exception as e:  # pragma: no cover - simple error propagation
        raise Exception(f"Calculation error: {str(e)}")
