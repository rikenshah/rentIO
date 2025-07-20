"""Financial calculation utilities for the backend API."""

from typing import Mapping, Any


def calculate_metrics(scenario: Mapping[str, Any]) -> dict:
    """Calculate investment metrics from the provided scenario."""
    try:
        # Convert Pydantic model to dictionary
        p = scenario.dict() if hasattr(scenario, 'dict') else scenario
        
        # Use mock data for now to get the frontend working
        # TODO: Implement real calculations later
        monthly_payment = 1440.0
        noi = 18000.0
        cap_rate = 6.0
        cash_flow = 7200.0
        cash_on_cash = 12.0
        stock_value = 129435.0
        npv = 45000.0
        irr = 8.5
        
        return {
            "monthly_payment": monthly_payment,
            "NOI": noi,
            "CapRate": cap_rate,
            "CashFlow": cash_flow,
            "CashOnCash": cash_on_cash,
            "StockValue": stock_value,
            "NPV": npv,
            "IRR": irr,
        }
    except Exception as e:
        raise Exception(f"Calculation error: {str(e)}")
