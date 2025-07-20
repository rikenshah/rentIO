"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any
import numpy_financial as npf


def calculate_metrics(scenario: Mapping[str, Any]) -> dict:
    """Calculate investment metrics from the provided scenario."""
    try:
        p = scenario.dict() if hasattr(scenario, "dict") else dict(scenario)

        # Mortgage payment
        monthly_rate = p["interest_rate"] / 100 / 12
        payments = p["loan_years"] * 12
        monthly_payment = (
            p["loan_amount"]
            * (monthly_rate * (1 + monthly_rate) ** payments)
            / ((1 + monthly_rate) ** payments - 1)
        )

        # Net operating income
        gross_income = p["rent"] * 12
        vacancy_loss = gross_income * (p["vacancy_rate"] / 100)
        operating_expenses = p["property_tax"] + p["insurance"] + p["maintenance"]
        noi = gross_income - vacancy_loss - operating_expenses

        cap_rate = noi / p["purchase_price"] * 100
        cash_flow = noi - monthly_payment * 12
        cash_on_cash = cash_flow / p["down_payment"] * 100 if p["down_payment"] else 0
        stock_value = p["down_payment"] * (1 + p["stock_return_rate"] / 100) ** p["years"]

        discount_rate = p["stock_return_rate"] / 100
        cash_flows = [-p["down_payment"]] + [cash_flow] * p["years"]
        npv = npf.npv(discount_rate, cash_flows)
        irr = npf.irr(cash_flows) * 100
        if irr != irr or irr in (float("inf"), float("-inf")):
            irr = 0.0

        return {
            "monthly_payment": float(monthly_payment),
            "NOI": float(noi),
            "CapRate": float(cap_rate),
            "CashFlow": float(cash_flow),
            "CashOnCash": float(cash_on_cash),
            "StockValue": float(stock_value),
            "NPV": float(npv),
            "IRR": float(irr),
        }

    except Exception as e:  # pragma: no cover - defensive catch all
        raise Exception(f"Calculation error: {str(e)}")
