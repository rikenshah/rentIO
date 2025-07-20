import axios from 'axios'
import { vi } from 'vitest'
import { calculateScenario, askLLM } from '../api'

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
