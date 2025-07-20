import { render, screen, fireEvent } from '@testing-library/react'
import ScenarioForm from '../components/ScenarioForm'
import React from 'react'

function setup() {
  const onCalculate = vi.fn()
  render(<ScenarioForm onCalculate={onCalculate} loading={false} />)
  return { onCalculate }
}

test('submits default form data', () => {
  const { onCalculate } = setup()
  const button = screen.getByRole('button', { name: /calculate investment/i })
  fireEvent.click(button)
  expect(onCalculate).toHaveBeenCalledTimes(1)
  expect(onCalculate.mock.calls[0][0]).toMatchObject({
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
  })
})
