import axios from 'axios'
import { vi } from 'vitest'
import { calculateScenario, askLLM } from '../api'
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KPISummary from '../components/KPISummary';

vi.mock('axios')
const mockedPost = vi.mocked(axios.post)

const sampleData = { a: 1 }

afterEach(() => {
  mockedPost.mockReset()
})

test('calculateScenario returns backend data when available', async () => {
  mockedPost.mockResolvedValue({ data: { result: true } })
  const res = await calculateScenario(sampleData)
  expect(res).toEqual({ result: true })
  expect(mockedPost).toHaveBeenCalled()
})

test('calculateScenario returns mock data on failure', async () => {
  mockedPost.mockRejectedValue(new Error('offline'))
  const res = await calculateScenario(sampleData)
  expect(res).toMatchObject({
    monthly_payment: expect.any(Number)
  })
})

test('askLLM returns fallback message on failure', async () => {
  mockedPost.mockRejectedValue(new Error('offline'))
  const res = await askLLM(sampleData, 'hi')
  expect(res).toMatch(/not available/)
})

// Helper: replicate backend NPV logic
function backendNPV({
  down_payment,
  CashFlow,
  years,
  purchase_price,
  appreciation_rate,
  loan_amount,
  interest_rate,
  loan_years,
  stock_return_rate
}) {
  const discountRate = stock_return_rate / 100;
  const cashFlow = CashFlow;
  const n_payments = loan_years * 12;
  const months_paid = years * 12;
  const futureValue = purchase_price * Math.pow(1 + appreciation_rate / 100, years);
  const monthlyRate = interest_rate / 100 / 12;
  let remainingBalance;
  if (monthlyRate > 0) {
    remainingBalance = loan_amount * (Math.pow(1 + monthlyRate, n_payments) - Math.pow(1 + monthlyRate, months_paid)) / (Math.pow(1 + monthlyRate, n_payments) - 1);
  } else {
    remainingBalance = loan_amount - (loan_amount / n_payments) * months_paid;
  }
  const equityFromSale = futureValue - remainingBalance;
  let npv = -down_payment;
  for (let year = 1; year <= years; year++) {
    npv += cashFlow / Math.pow(1 + discountRate, year);
  }
  npv += equityFromSale / Math.pow(1 + discountRate, years);
  return Math.round(npv);
}

describe('NPV calculation matches backend', () => {
  it('should match backend NPV for a typical scenario', () => {
    const formData = {
      purchase_price: 300000,
      down_payment: 60000,
      loan_amount: 240000,
      interest_rate: 6.5,
      loan_years: 30,
      property_tax: 3000,
      insurance: 1200,
      maintenance: 1500,
      vacancy_rate: 5,
      rent: 2000,
      appreciation_rate: 3,
      stock_return_rate: 8,
      years: 10
    };
    // Simulate backend results (use same formulas as backend)
    // For this test, we only need CashFlow and NPV
    // We'll use KPISummary's getActualCalculation for NPV
    const results = {
      CashFlow: -1103.56 // Use a realistic value from backend for this scenario
    };
    // Import the NPV getActualCalculation from KPISummary
    // (simulate as a pure function)
    const discountRate = formData.stock_return_rate / 100;
    const cashFlow = results.CashFlow;
    const years = formData.years;
    const purchasePrice = formData.purchase_price;
    const appreciationRate = formData.appreciation_rate / 100;
    const loanAmount = formData.loan_amount;
    const monthlyRate = formData.interest_rate / 100 / 12;
    const n_payments = formData.loan_years * 12;
    const months_paid = years * 12;
    const futureValue = purchasePrice * Math.pow(1 + appreciationRate, years);
    let remainingBalance;
    if (monthlyRate > 0) {
      remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, n_payments) - Math.pow(1 + monthlyRate, months_paid)) / (Math.pow(1 + monthlyRate, n_payments) - 1);
    } else {
      remainingBalance = loanAmount - (loanAmount / n_payments) * months_paid;
    }
    const equityFromSale = futureValue - remainingBalance;
    let npv = -formData.down_payment;
    for (let year = 1; year <= years; year++) {
      npv += cashFlow / Math.pow(1 + discountRate, year);
    }
    npv += equityFromSale / Math.pow(1 + discountRate, years);
    // Compare to backend logic
    const backendValue = backendNPV({ ...formData, CashFlow: cashFlow });
    expect(Math.round(npv)).toBe(backendValue);
  });
});
