from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
import math
import logging
from .calc import calculate_metrics
from .llm import get_llm_response
from .local_llm import get_local_llm_response

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScenarioInput(BaseModel):
    purchase_price: float = Field(..., gt=0)
    down_payment: float = Field(..., gt=0)
    loan_amount: float = Field(..., ge=0)
    interest_rate: float = Field(..., ge=0)
    loan_years: int = Field(..., gt=0)
    property_tax: float = Field(..., ge=0)
    insurance: float = Field(..., ge=0)
    maintenance: float = Field(..., ge=0)
    vacancy_rate: float = Field(..., ge=0, le=100)
    rent: float = Field(..., ge=0)
    appreciation_rate: float = Field(..., ge=-100)
    stock_return_rate: float = Field(..., ge=-100)
    years: int = Field(..., gt=0)

    @model_validator(mode="after")
    def check_values(self):
        if self.down_payment > self.purchase_price:
            raise ValueError("down_payment cannot exceed purchase_price")
        expected_loan = self.purchase_price - self.down_payment
        if not math.isclose(self.loan_amount, expected_loan, rel_tol=1e-2):
            raise ValueError("loan_amount must equal purchase_price - down_payment")
        return self

class LLMRequest(BaseModel):
    scenario: ScenarioInput
    question: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/test")
def test_endpoint():
    return {"message": "Test endpoint working"}

@app.post("/calculate")
def calculate(scenario: ScenarioInput):
    try:
        logger.info(f"Received scenario: {scenario}")
        # Convert to dict for debugging
        scenario_dict = scenario.model_dump()
        logger.info(f"Scenario dict: {scenario_dict}")
        
        result = calculate_metrics(scenario)
        logger.info(f"Calculation result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in calculate endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/llm")
def llm_response(req: LLMRequest):
    try:
        return {"response": get_llm_response(req.scenario, req.question)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/local_llm")
def local_llm_response(req: LLMRequest):
    """Respond to the user's question using the local LLM."""
    try:
        return {"response": get_local_llm_response(req.scenario, req.question)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
