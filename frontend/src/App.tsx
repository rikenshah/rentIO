import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, AppBar, Toolbar, Typography, Snackbar, Alert } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import ScenarioForm from './components/ScenarioForm';
import KPISummary from './components/KPISummary';
import LLMChat, { ChatMessage } from './components/LLMChat';
import { calculateScenario, askLLM } from './api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052CC',
    },
    secondary: {
      main: '#2EC4B6',
    },
    background: {
      default: '#f8fbff',
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
      },
    },
  },
});

interface CalculationResult {
  monthly_payment: number;
  NOI: number;
  CapRate: number;
  CashFlow: number;
  CashOnCash: number;
  StockValue: number;
  NPV: number;
  IRR: number;
}

function App() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [llmResponse, setLlmResponse] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentFormData, setCurrentFormData] = useState<any>(null);

  const handleCalculate = async (formData: any) => {
    setLoading(true);
    setError(null);
    setLlmResponse(null);
    setCurrentFormData(formData);
    
    try {
      const result = await calculateScenario(formData);
      setResults(result);
      
      // Get LLM recommendation
      const llmResult = await askLLM(formData, "Analyze this investment scenario and provide a brief recommendation.");
      setLlmResponse(llmResult);
      setChatMessages([{ role: 'assistant', content: llmResult }]);
    } catch (err) {
      setError('Failed to calculate investment metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async (message: string) => {
    if (!currentFormData) return;
    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    try {
      const reply = await askLLM(currentFormData, message);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Assistant unavailable.' }]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #0052CC 0%, #2EC4B6 100%)',
          color: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <CalculateIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Real Estate vs. Stock Investment Tool
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 4,
            maxWidth: '1400px',
            mx: 'auto',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Left Column - Investment Parameters */}
          <Box sx={{ order: { xs: 2, lg: 1 } }}>
            <ScenarioForm onCalculate={handleCalculate} loading={loading} />
          </Box>
          
          {/* Right Column - Investment Analysis */}
          <Box sx={{ order: { xs: 1, lg: 2 } }}>
            <KPISummary results={results} llmResponse={llmResponse} formData={currentFormData} />
            {results && (
              <LLMChat messages={chatMessages} onSend={handleChatSend} />
            )}
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
