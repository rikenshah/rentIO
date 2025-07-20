from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from .calc import calculate_metrics
from .llm import get_llm_response

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
    purchase_price: float
    down_payment: float
    loan_amount: float
    interest_rate: float
    loan_years: int
    property_tax: float
    insurance: float
    maintenance: float
    vacancy_rate: float
    rent: float
    appreciation_rate: float
    stock_return_rate: float
    years: int

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