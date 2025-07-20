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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

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

const fieldTooltips: Record<string, string> = {
  purchase_price: 'The total price you pay for the property.',
  down_payment: 'The upfront cash payment you make (not financed).',
  loan_amount: 'The amount you borrow from the lender.',
  interest_rate: 'The annual interest rate on your mortgage.',
  loan_years: 'The number of years for your mortgage loan.',
  property_tax: 'Annual property tax paid to the local government.',
  insurance: 'Annual property insurance cost.',
  maintenance: 'Annual maintenance and repair costs.',
  vacancy_rate: 'Percent of time the property is expected to be vacant.',
  rent: 'Monthly rent you expect to collect.',
  appreciation_rate: 'Expected annual property value increase (%).',
  stock_return_rate: 'Expected annual return if you invested in stocks instead (%).',
  years: 'Number of years you plan to hold the investment.'
};

const ScenarioForm: React.FC<ScenarioFormProps> = ({ formData, onFormDataChange, onCalculate, loading }) => {
  const safeFormData = { ...defaultFormData, ...(formData || {}) };

  // Helper to strip leading zeroes and ensure number
  const normalizeNumber = (value: string | number) => {
    if (typeof value === 'number') return value;
    // Remove leading zeroes, allow empty string
    const stripped = value.replace(/^0+(?=\d)/, '');
    // If not a valid number, return empty string for display
    return stripped === '' || isNaN(Number(stripped)) ? '' : Number(stripped);
  };

  const handleInputChange = (field: string, value: number | string) => {
    // Always parse as number and strip leading zeroes
    let cleanValue = value;
    if (typeof value === 'string') {
      cleanValue = normalizeNumber(value);
      cleanValue = cleanValue === '' ? 0 : Number(cleanValue);
    }
    onFormDataChange({
      ...safeFormData,
      [field]: cleanValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(safeFormData);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
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
                  label={
                    <span>
                      Purchase Price
                      <Tooltip title={fieldTooltips.purchase_price} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.purchase_price)}
                  onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Down Payment
                      <Tooltip title={fieldTooltips.down_payment} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.down_payment)}
                  onChange={(e) => handleInputChange('down_payment', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Loan Amount
                      <Tooltip title={fieldTooltips.loan_amount} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.loan_amount)}
                  onChange={(e) => handleInputChange('loan_amount', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Interest Rate
                      <Tooltip title={fieldTooltips.interest_rate} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.interest_rate)}
                  onChange={(e) => handleInputChange('interest_rate', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Loan Years
                      <Tooltip title={fieldTooltips.loan_years} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.loan_years)}
                  onChange={(e) => handleInputChange('loan_years', e.target.value)}
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
                  label={
                    <span>
                      Property Tax
                      <Tooltip title={fieldTooltips.property_tax} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.property_tax)}
                  onChange={(e) => handleInputChange('property_tax', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Insurance
                      <Tooltip title={fieldTooltips.insurance} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.insurance)}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Maintenance
                      <Tooltip title={fieldTooltips.maintenance} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.maintenance)}
                  onChange={(e) => handleInputChange('maintenance', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Vacancy Rate
                      <Tooltip title={fieldTooltips.vacancy_rate} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.vacancy_rate)}
                  onChange={(e) => handleInputChange('vacancy_rate', e.target.value)}
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
                  label={
                    <span>
                      Monthly Rent
                      <Tooltip title={fieldTooltips.rent} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.rent)}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Appreciation Rate
                      <Tooltip title={fieldTooltips.appreciation_rate} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.appreciation_rate)}
                  onChange={(e) => handleInputChange('appreciation_rate', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Stock Return Rate
                      <Tooltip title={fieldTooltips.stock_return_rate} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.stock_return_rate)}
                  onChange={(e) => handleInputChange('stock_return_rate', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Investment Years
                      <Tooltip title={fieldTooltips.years} placement="top">
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', color: 'action.active' }} />
                      </Tooltip>
                    </span>
                  }
                  type="number"
                  value={normalizeNumber(safeFormData.years)}
                  onChange={(e) => handleInputChange('years', e.target.value)}
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