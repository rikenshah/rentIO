import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, AppBar, Toolbar, Typography, Snackbar, Alert } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import ScenarioForm from './components/ScenarioForm';
import ScenarioSwitcher from './components/ScenarioSwitcher';
import KPISummary from './components/KPISummary';
import ChatAssistant from './components/ChatAssistant';
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
  const defaultScenario = {
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
    years: 10,
  };

  const [scenarios, setScenarios] = useState([
    { name: 'Base case', data: { ...defaultScenario } },
    {
      name: 'Stress test',
      data: { ...defaultScenario, vacancy_rate: 10, appreciation_rate: 1 },
    },
  ]);
  const [activeScenario, setActiveScenario] = useState(0);

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [llmResponse, setLlmResponse] = useState<string | null>(null);
  const currentFormData = scenarios[activeScenario].data;

  const handleFormDataChange = (data: any) => {
    setScenarios((prev) =>
      prev.map((s, idx) => (idx === activeScenario ? { ...s, data } : s))
    );
  };

  const handleCalculate = async (formData: any) => {
    setLoading(true);
    setError(null);
    setLlmResponse(null);
    // Keep current scenario's data for KPI summary
    
    try {
      const result = await calculateScenario(formData);
      setResults(result);
      
      // Get LLM recommendation
      const llmResult = await askLLM(formData, "Analyze this investment scenario and provide a brief recommendation.");
      setLlmResponse(llmResult);
    } catch (err) {
      setError('Failed to calculate investment metrics. Please try again.');
    } finally {
      setLoading(false);
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
            <ScenarioSwitcher
              scenarios={scenarios}
              activeIndex={activeScenario}
              onChange={(idx) => setActiveScenario(idx)}
            />
            <ScenarioForm
              formData={currentFormData}
              onFormDataChange={handleFormDataChange}
              onCalculate={handleCalculate}
              loading={loading}
            />
          </Box>
          
          {/* Right Column - Investment Analysis */}
          <Box sx={{ order: { xs: 1, lg: 2 } }}>
            <KPISummary results={results} llmResponse={llmResponse} formData={currentFormData} />
            <ChatAssistant scenario={currentFormData} />
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
