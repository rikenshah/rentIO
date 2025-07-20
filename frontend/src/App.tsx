import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, AppBar, Toolbar, Typography, Snackbar, Alert } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import ScenarioForm from './components/ScenarioForm';
import KPISummary from './components/KPISummary';
import { calculateScenario, askLLM } from './api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface CalculationResult {
  monthly_payment: number;
  NOI: number;
  CapRate: number;
  CashFlow: number;
  CashOnCash: number;
  DSCR: number;
  StockValue: number;
  NPV: number;
  IRR: number;
}

function App() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [llmResponse, setLlmResponse] = useState<string | null>(null);
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
    } catch (err) {
      setError('Failed to calculate investment metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
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
