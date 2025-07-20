"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any, List
import math
import numpy as np
import numpy_financial as npf


def calculate_metrics(scenario: Mapping[str, Any]) -> dict:
    """Calculate investment metrics from the provided scenario."""
    try:
        # Convert Pydantic model to dictionary
        p = scenario.model_dump() if hasattr(scenario, "model_dump") else scenario
        
        # Mortgage calculation (reference: rental-property-calc-ts)
        loan_amount = float(p["loan_amount"])
        n_payments = int(p["loan_years"]) * 12
        monthly_rate = float(p["interest_rate"]) / 12 / 100

        if monthly_rate > 0:
            numerator = loan_amount * monthly_rate * (1 + monthly_rate) ** n_payments
            denominator = (1 + monthly_rate) ** n_payments - 1
            monthly_payment = numerator / denominator
        else:
            monthly_payment = loan_amount / n_payments
        
        # Operating expenses and NOI calculation
        annual_expenses = (
            float(p["property_tax"])
            + float(p["insurance"])
            + float(p["maintenance"])
            + (float(p["vacancy_rate"]) / 100) * float(p["rent"]) * 12
        )

        noi = float(p["rent"]) * 12 - annual_expenses
        cap_rate = noi / float(p["purchase_price"]) if float(p["purchase_price"]) else 0
        cash_flow = noi - monthly_payment * 12
        cash_on_cash = cash_flow / float(p["down_payment"]) if float(p["down_payment"]) else 0

        # Stock simulation
        stock_value = float(p["down_payment"]) * (
            (1 + float(p["stock_return_rate"]) / 100) ** int(p["years"])
        )

        # Future property value and remaining loan balance
        appreciation_rate = float(p["appreciation_rate"]) / 100
        years = int(p["years"])
        future_value = float(p["purchase_price"]) * (1 + appreciation_rate) ** years

        months_paid = years * 12
        if monthly_rate > 0:
            remaining_balance = loan_amount * (
                (1 + monthly_rate) ** n_payments - (1 + monthly_rate) ** months_paid
            ) / ((1 + monthly_rate) ** n_payments - 1)
        else:
            remaining_balance = loan_amount - (loan_amount / n_payments) * months_paid

        equity_sale = future_value - remaining_balance

        # Cash flow series for IRR/NPV
        cash_flows: List[float] = [-float(p["down_payment"])] + [cash_flow] * years + [equity_sale]

        discount_rate = float(p["stock_return_rate"]) / 100
        npv = npf.npv(discount_rate, cash_flows)

        # IRR using numpy_financial
        try:
            irr = npf.irr(cash_flows)
        except Exception:
            irr = float("nan")
        
        return {
            "monthly_payment": monthly_payment,
            "NOI": noi,
            "CapRate": cap_rate * 100,  # Convert to percentage
            "CashFlow": cash_flow,
            "CashOnCash": cash_on_cash * 100,  # Convert to percentage
            "StockValue": stock_value,
            "NPV": npv,
            "IRR": irr * 100,  # Convert to percentage
        }
    except Exception as e:
        raise Exception(f"Calculation error: {str(e)}")
