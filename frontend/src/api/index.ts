import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for when backend is not available
const mockCalculation = (data: any) => ({
  monthly_payment: 1440.00,
  NOI: 18000.00,
  CapRate: 6.00,
  CashFlow: 7200.00,
  CashOnCash: 12.00,
  DSCR: 1.20,
  StockValue: 129435.00,
  NPV: 45000.00,
  IRR: 8.50,
});

export async function calculateScenario(data: any) {
  try {
    const res = await axios.post(`${API_URL}/calculate`, data);
    return res.data;
  } catch (error) {
    console.warn('Backend not available, using mock data');
    return mockCalculation(data);
  }
}

export async function askLLM(scenario: any, question: string) {
  try {
    const res = await axios.post(`${API_URL}/llm`, { scenario, question });
    return res.data.response;
  } catch (error) {
    return "I'm sorry, the AI assistant is not available right now. Please try again later.";
  }
} 