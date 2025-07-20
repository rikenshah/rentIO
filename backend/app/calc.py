"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any
import math


def calculate_metrics(scenario: Mapping[str, Any]) -> dict:
    """Calculate investment metrics from the provided scenario."""
    try:
        # Convert Pydantic model to dictionary
        p = scenario.model_dump() if hasattr(scenario, 'model_dump') else scenario

        # Inputs
        purchase_price = float(p['purchase_price'])
        down_payment = float(p['down_payment'])
        loan_amount = float(p['loan_amount'])
        interest_rate = float(p['interest_rate'])
        loan_years = int(p['loan_years'])
        property_tax = float(p['property_tax'])
        insurance = float(p['insurance'])
        maintenance = float(p['maintenance'])
        vacancy_rate = float(p['vacancy_rate']) / 100
        rent = float(p['rent'])
        appreciation_rate = float(p['appreciation_rate']) / 100
        stock_return_rate = float(p['stock_return_rate']) / 100
        years = int(p['years'])

        # 1. Gross Scheduled Income (annual)
        gross_income = rent * 12
        # 2. Vacancy Loss (annual)
        vacancy_loss = gross_income * vacancy_rate
        # 3. Operating Expenses (annual, excluding vacancy)
        operating_expenses = property_tax + insurance + maintenance
        # 4. Net Operating Income (NOI)
        noi = gross_income - vacancy_loss - operating_expenses
        # 5. Cap Rate
        cap_rate = noi / purchase_price if purchase_price else 0

        # 6. Mortgage Payment (monthly)
        n_payments = loan_years * 12
        monthly_rate = interest_rate / 12 / 100
        if monthly_rate > 0:
            monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** n_payments) / ((1 + monthly_rate) ** n_payments - 1)
        else:
            monthly_payment = loan_amount / n_payments
        annual_debt_service = monthly_payment * 12

        # 7. Cash Flow (annual)
        cash_flow = noi - annual_debt_service
        # 8. Cash-on-Cash Return
        cash_on_cash = cash_flow / down_payment if down_payment else 0

        # 9. Stock Investment Value (future value of down payment)
        stock_value = down_payment * ((1 + stock_return_rate) ** years)

        # 10. NPV/IRR: include property sale at end
        # Property value at end
        future_value = purchase_price * ((1 + appreciation_rate) ** years)
        # Remaining loan balance after 'years'
        months_paid = years * 12
        if monthly_rate > 0:
            remaining_balance = loan_amount * ((1 + monthly_rate) ** n_payments - (1 + monthly_rate) ** months_paid) / ((1 + monthly_rate) ** n_payments - 1)
        else:
            remaining_balance = loan_amount - (loan_amount / n_payments) * months_paid
        equity_from_sale = future_value - remaining_balance
        # Cash flows: initial investment, annual cash flows, final sale
        cash_flows = [-down_payment] + [cash_flow] * years + [equity_from_sale]
        discount_rate = stock_return_rate
        try:
            import numpy_financial as npf
            npv = npf.npv(discount_rate, cash_flows)
            irr = npf.irr(cash_flows)
            if irr is None or math.isnan(irr) or math.isinf(irr):
                irr = 0.0
        except ImportError:
            # Fallback: simple approx (ignores sale)
            npv = -down_payment + sum([cash_flow / ((1 + discount_rate) ** (i + 1)) for i in range(years)])
            if cash_flow > 0 and down_payment > 0:
                irr = (cash_flow / down_payment) ** (1 / years) - 1
                irr = max(0, irr)
            else:
                irr = 0.0

        return {
            "monthly_payment": round(monthly_payment, 2),
            "NOI": round(noi, 2),
            "CapRate": round(cap_rate * 100, 2),  # percent
            "CashFlow": round(cash_flow, 2),
            "CashOnCash": round(cash_on_cash * 100, 2),  # percent
            "StockValue": round(stock_value, 2),
            "NPV": round(npv, 2),
            "IRR": round(irr * 100, 2),  # percent
        }
    except Exception as e:
        raise Exception(f"Calculation error: {str(e)}")
