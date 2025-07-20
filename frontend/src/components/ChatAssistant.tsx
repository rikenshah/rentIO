import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Typography } from '@mui/material'
import { askLLM } from '../api'

interface Props {
  scenario: any
}

const ChatAssistant: React.FC<Props> = ({ scenario }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    const resp = await askLLM(scenario, question)
    setAnswer(resp)
    setLoading(false)
  }

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Chat Assistant
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Ask a question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
        />
        <Button variant="contained" onClick={handleAsk} disabled={loading}>
          Ask
        </Button>
      </Box>
      {answer && (
        <Typography sx={{ mt: 2 }}>{answer}</Typography>
      )}
    </Paper>
  )
}

export default ChatAssistant
