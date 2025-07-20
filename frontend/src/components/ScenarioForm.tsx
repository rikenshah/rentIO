import React, { useState } from 'react';
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
  onCalculate: (data: any) => void;
  loading: boolean;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onCalculate, loading }) => {
  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
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
                  value={formData.purchase_price}
                  onChange={(e) => handleInputChange('purchase_price', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Down Payment"
                  type="number"
                  value={formData.down_payment}
                  onChange={(e) => handleInputChange('down_payment', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => handleInputChange('loan_amount', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Interest Rate"
                  type="number"
                  value={formData.interest_rate}
                  onChange={(e) => handleInputChange('interest_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Years"
                  type="number"
                  value={formData.loan_years}
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
                  value={formData.property_tax}
                  onChange={(e) => handleInputChange('property_tax', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance"
                  type="number"
                  value={formData.insurance}
                  onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maintenance"
                  type="number"
                  value={formData.maintenance}
                  onChange={(e) => handleInputChange('maintenance', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vacancy Rate"
                  type="number"
                  value={formData.vacancy_rate}
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
                  value={formData.rent}
                  onChange={(e) => handleInputChange('rent', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appreciation Rate"
                  type="number"
                  value={formData.appreciation_rate}
                  onChange={(e) => handleInputChange('appreciation_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Return Rate"
                  type="number"
                  value={formData.stock_return_rate}
                  onChange={(e) => handleInputChange('stock_return_rate', Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Investment Years"
                  type="number"
                  value={formData.years}
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
              minWidth: 200
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