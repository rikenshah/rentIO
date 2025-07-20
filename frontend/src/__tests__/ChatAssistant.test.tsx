import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import ChatAssistant from '../components/ChatAssistant'
import * as api from '../api'

vi.mock('../api')

const mockedAsk = vi.mocked(api.askLLM)

beforeEach(() => {
  mockedAsk.mockResolvedValue('answer')
})

test('sends question to askLLM and displays answer', async () => {
  render(<ChatAssistant scenario={{}} />)
  const input = screen.getByLabelText(/ask a question/i)
  fireEvent.change(input, { target: { value: 'Hello' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(mockedAsk).toHaveBeenCalledWith({}, 'Hello')
  await screen.findByText('answer')
})
