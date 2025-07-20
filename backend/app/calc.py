"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any
import math


def calculate_metrics(scenario: Mapping[str, Any]) -> dict:
    """Calculate investment metrics from the provided scenario."""
    try:
        # Convert Pydantic model to dictionary
        p = scenario.model_dump() if hasattr(scenario, 'model_dump') else scenario
        
        # Mortgage calculation
        loan_amount = float(p['loan_amount'])
        n_payments = int(p['loan_years']) * 12
        monthly_rate = float(p['interest_rate']) / 12 / 100
        
        if monthly_rate > 0:
            monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** n_payments) / ((1 + monthly_rate) ** n_payments - 1)
        else:
            monthly_payment = loan_amount / n_payments
        
        # Operating expenses and NOI calculation
        annual_expenses = float(p['property_tax']) + float(p['insurance']) + float(p['maintenance']) + (float(p['vacancy_rate']) / 100) * float(p['rent']) * 12
        noi = float(p['rent']) * 12 - annual_expenses
        cap_rate = noi / float(p['purchase_price']) if float(p['purchase_price']) else 0
        cash_flow = noi - monthly_payment * 12
        cash_on_cash = cash_flow / float(p['down_payment']) if float(p['down_payment']) else 0
        
        # Stock simulation
        stock_value = float(p['down_payment']) * ((1 + float(p['stock_return_rate']) / 100) ** int(p['years']))
        
        # NPV calculation (simplified)
        discount_rate = float(p['stock_return_rate']) / 100
        npv = -float(p['down_payment']) + sum([cash_flow / ((1 + discount_rate) ** (i + 1)) for i in range(int(p['years']))])
        
        # IRR calculation (simplified)
        if cash_flow > 0 and float(p['down_payment']) > 0:
            # Simple IRR approximation
            irr = (cash_flow / float(p['down_payment'])) ** (1 / int(p['years'])) - 1
            irr = max(0, irr)  # Ensure non-negative
        else:
            irr = 0
        
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
