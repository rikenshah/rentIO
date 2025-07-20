import React from 'react';
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

interface ScenarioFormProps {
  formData: any;
  onFormDataChange: (data: any) => void;
  onCalculate: (data: any) => void;
  loading: boolean;
}

const defaultFormData = {
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

const ScenarioForm: React.FC<ScenarioFormProps> = ({ formData, onFormDataChange, onCalculate, loading }) => {
  const safeFormData = { ...defaultFormData, ...(formData || {}) };

  const handleInputChange = (field: string, value: number) => {
    onFormDataChange({
      ...safeFormData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(safeFormData);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, backgroundColor: '#fff' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Investment Parameters
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Property Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  value={safeFormData.purchase_price}
                  onChange={(e) => handleInputChange('purchase_price', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Down Payment"
                  type="number"
                  value={safeFormData.down_payment}
                  onChange={(e) => handleInputChange('down_payment', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Amount"
                  type="number"
                  value={safeFormData.loan_amount}
                  onChange={(e) => handleInputChange('loan_amount', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Interest Rate"
                  type="number"
                  value={safeFormData.interest_rate}
                  onChange={(e) => handleInputChange('interest_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Years"
                  type="number"
                  value={safeFormData.loan_years}
                  onChange={(e) => handleInputChange('loan_years', Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Operating Expenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Property Tax"
                  type="number"
                  value={safeFormData.property_tax}
                  onChange={(e) => handleInputChange('property_tax', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance"
                  type="number"
                  value={safeFormData.insurance}
                  onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maintenance"
                  type="number"
                  value={safeFormData.maintenance}
                  onChange={(e) => handleInputChange('maintenance', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vacancy Rate"
                  type="number"
                  value={safeFormData.vacancy_rate}
                  onChange={(e) => handleInputChange('vacancy_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TrendingUpIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Income & Growth</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  type="number"
                  value={safeFormData.rent}
                  onChange={(e) => handleInputChange('rent', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appreciation Rate"
                  type="number"
                  value={safeFormData.appreciation_rate}
                  onChange={(e) => handleInputChange('appreciation_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Return Rate"
                  type="number"
                  value={safeFormData.stock_return_rate}
                  onChange={(e) => handleInputChange('stock_return_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Investment Years"
                  type="number"
                  value={safeFormData.years}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              minWidth: 200,
              background: 'linear-gradient(90deg, #0052CC 0%, #2EC4B6 100%)'
            }}
          >
            {loading ? 'Calculating...' : 'Calculate Investment'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ScenarioForm; 