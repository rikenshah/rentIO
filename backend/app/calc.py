from typing import Dict
import numpy as np


def _monthly_mortgage_payment(loan_amount: float, annual_rate: float, years: int) -> float:
    """Calculate standard monthly mortgage payment."""
    r = annual_rate / 100 / 12
    n = years * 12
    if r == 0:
        return loan_amount / n
    return loan_amount * (r * (1 + r) ** n) / ((1 + r) ** n - 1)


def _irr(cash_flows):
    """Compute internal rate of return using numpy-financial if available."""
    try:
        import numpy_financial as npf  # type: ignore
        return npf.irr(cash_flows) * 100
    except Exception:
        # Fallback simple approximation
        return np.irr(cash_flows) * 100


def calculate_metrics(scenario) -> Dict[str, float]:
    """Return a set of investment metrics calculated from the scenario."""
    try:
        data = scenario.dict() if hasattr(scenario, "dict") else scenario

        # Mortgage
        monthly_payment = _monthly_mortgage_payment(
            data["loan_amount"], data["interest_rate"], data["loan_years"]
        )
        annual_debt_service = monthly_payment * 12

        # Income calculations
        gross_income = data["rent"] * 12
        vacancy_loss = gross_income * (data["vacancy_rate"] / 100)
        operating_expenses = data["property_tax"] + data["insurance"] + data["maintenance"]
        noi = gross_income - vacancy_loss - operating_expenses

        cap_rate = (noi / data["purchase_price"]) * 100

        cash_flow = noi - annual_debt_service

        cash_on_cash = (cash_flow / data["down_payment"]) * 100 if data["down_payment"] else 0

        # Stock market comparison
        stock_value = data["down_payment"] * (1 + data["stock_return_rate"] / 100) ** data["years"]

        # Basic NPV using a fixed discount rate
        discount_rate = 0.10
        npv = -data["down_payment"]
        for year in range(1, data["years"] + 1):
            npv += cash_flow / (1 + discount_rate) ** year

        # Internal rate of return
        cash_flows = [-data["down_payment"]] + [cash_flow] * data["years"]
        irr = _irr(cash_flows)

        # Debt service coverage ratio
        dscr = noi / annual_debt_service if annual_debt_service else 0

        return {
            "monthly_payment": monthly_payment,
            "NOI": noi,
            "CapRate": cap_rate,
            "CashFlow": cash_flow,
            "CashOnCash": cash_on_cash,
            "StockValue": stock_value,
            "NPV": npv,
            "IRR": irr,
            "DSCR": dscr,
        }
    except Exception as e:  # pragma: no cover - simple error propagation
        raise Exception(f"Calculation error: {str(e)}")
