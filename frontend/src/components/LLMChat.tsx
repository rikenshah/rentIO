import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface LLMChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => Promise<void>;
}

const LLMChat: React.FC<LLMChatProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    await onSend(input.trim());
    setInput('');
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chat with Advisor
      </Typography>
      <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 1 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography variant="subtitle2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
              {msg.role === 'user' ? 'You' : 'Advisor'}:
            </Typography>
            <Typography variant="body2">{msg.content}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Paper>
  );
};

export default LLMChat;
