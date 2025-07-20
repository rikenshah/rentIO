import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import {
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Calculate as CalculateIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import InvestmentCharts from './InvestmentCharts';

interface KPISummaryProps {
  results: any;
  llmResponse?: string | null;
  formData?: any;
}

interface MetricInfo {
  title: string;
  definition: string;
  calculation: string[];
  insights: string[];
  icon: React.ReactNode;
  getActualCalculation?: (results: any, formData: any) => { steps: string[], finalValue: string };
}

const KPISummary: React.FC<KPISummaryProps> = ({ results, llmResponse, formData }) => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const metricInfo: Record<string, MetricInfo> = {
    monthly_payment: {
      title: 'Monthly Mortgage Payment',
      definition: 'The monthly payment you make to your lender, which includes both principal and interest on your mortgage loan.',
      calculation: [
        'Calculate monthly interest rate: Annual Rate ÷ 12',
        'Calculate total number of payments: Loan Years × 12',
        'Use the mortgage payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]',
        'Where: P = Payment, L = Loan Amount, c = Monthly Interest Rate, n = Total Payments'
      ],
      insights: [
        'Lower interest rates significantly reduce monthly payments',
        'Longer loan terms reduce monthly payments but increase total interest paid',
        'Consider refinancing when rates drop by 1% or more',
        'Extra payments toward principal can reduce total interest paid'
      ],
      icon: <MoneyIcon />,
      getActualCalculation: (results, formData) => {
        const monthlyRate = formData.interest_rate / 100 / 12;
        const totalPayments = formData.loan_years * 12;
        const payment = formData.loan_amount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
        
        return {
          steps: [
            `Monthly Interest Rate = ${formData.interest_rate}% ÷ 12 = ${(formData.interest_rate / 12).toFixed(4)}%`,
            `Total Payments = ${formData.loan_years} years × 12 = ${totalPayments} payments`,
            `Payment = $${formData.loan_amount.toLocaleString()} × (${(monthlyRate * 100).toFixed(4)}% × (1 + ${(monthlyRate * 100).toFixed(4)}%)^${totalPayments}) ÷ ((1 + ${(monthlyRate * 100).toFixed(4)}%)^${totalPayments} - 1)`,
            `Monthly Payment = ${formatCurrency(payment)}`
          ],
          finalValue: formatCurrency(payment)
        };
      }
    },
    NOI: {
      title: 'Net Operating Income',
      definition: 'The annual income generated from a property after deducting all operating expenses but before financing costs and taxes.',
      calculation: [
        'Calculate Gross Rental Income: Monthly Rent × 12',
        'Subtract Vacancy Loss: Gross Income × (Vacancy Rate ÷ 100)',
        'Subtract Operating Expenses: Property Tax + Insurance + Maintenance',
        'NOI = Gross Income - Vacancy Loss - Operating Expenses'
      ],
      insights: [
        'Higher NOI indicates better property performance',
        'Focus on properties with NOI > 6% of property value',
        'Reduce operating expenses to increase NOI',
        'Consider rent increases to boost NOI over time'
      ],
      icon: <AccountBalanceIcon />,
      getActualCalculation: (results, formData) => {
        const grossIncome = formData.rent * 12;
        const vacancyLoss = grossIncome * (formData.vacancy_rate / 100);
        const operatingExpenses = formData.property_tax + formData.insurance + formData.maintenance;
        const noi = grossIncome - vacancyLoss - operatingExpenses;
        
        return {
          steps: [
            `Gross Rental Income = $${formData.rent.toLocaleString()} × 12 = ${formatCurrency(grossIncome)}`,
            `Vacancy Loss = ${formatCurrency(grossIncome)} × ${formData.vacancy_rate}% = ${formatCurrency(vacancyLoss)}`,
            `Operating Expenses = $${formData.property_tax.toLocaleString()} + $${formData.insurance.toLocaleString()} + $${formData.maintenance.toLocaleString()} = ${formatCurrency(operatingExpenses)}`,
            `NOI = ${formatCurrency(grossIncome)} - ${formatCurrency(vacancyLoss)} - ${formatCurrency(operatingExpenses)} = ${formatCurrency(noi)}`
          ],
          finalValue: formatCurrency(noi)
        };
      }
    },
    CapRate: {
      title: 'Capitalization Rate',
      definition: 'The annual return on investment based on the property\'s net operating income relative to its purchase price.',
      calculation: [
        'Calculate Net Operating Income (NOI)',
        'Divide NOI by Property Purchase Price',
        'Multiply by 100 to get percentage',
        'Cap Rate = (NOI ÷ Purchase Price) × 100'
      ],
      insights: [
        'Higher cap rates indicate higher potential returns but may signal higher risk',
        'Target cap rates: 6-8% for residential, 8-12% for commercial',
        'Lower cap rates often indicate premium locations or properties',
        'Compare cap rates within the same market and property type'
      ],
      icon: <PercentIcon />,
      getActualCalculation: (results, formData) => {
        const noi = results.NOI;
        const capRate = (noi / formData.purchase_price) * 100;
        
        return {
          steps: [
            `NOI = ${formatCurrency(noi)}`,
            `Purchase Price = ${formatCurrency(formData.purchase_price)}`,
            `Cap Rate = (${formatCurrency(noi)} ÷ ${formatCurrency(formData.purchase_price)}) × 100`,
            `Cap Rate = ${formatPercent(capRate)}`
          ],
          finalValue: formatPercent(capRate)
        };
      }
    },
    CashFlow: {
      title: 'Annual Cash Flow',
      definition: 'The net amount of money left after all income and expenses, including mortgage payments.',
      calculation: [
        'Start with Net Operating Income (NOI)',
        'Subtract Annual Mortgage Payments: Monthly Payment × 12',
        'Cash Flow = NOI - Annual Mortgage Payments',
        'Positive cash flow means the property pays for itself'
      ],
      insights: [
        'Positive cash flow is crucial for sustainable real estate investing',
        'Aim for cash flow of at least $200-500 per month per property',
        'Consider cash-on-cash return for better comparison across properties',
        'Factor in maintenance reserves for unexpected expenses'
      ],
      icon: <TrendingUpIcon />,
      getActualCalculation: (results, formData) => {
        const noi = results.NOI;
        const annualMortgage = results.monthly_payment * 12;
        const cashFlow = noi - annualMortgage;
        
        return {
          steps: [
            `NOI = ${formatCurrency(noi)}`,
            `Annual Mortgage Payments = ${formatCurrency(results.monthly_payment)} × 12 = ${formatCurrency(annualMortgage)}`,
            `Cash Flow = ${formatCurrency(noi)} - ${formatCurrency(annualMortgage)}`,
            `Cash Flow = ${formatCurrency(cashFlow)}`
          ],
          finalValue: formatCurrency(cashFlow)
        };
      }
    },
    CashOnCash: {
      title: 'Cash-on-Cash Return',
      definition: 'The annual return on the actual cash invested in the property, expressed as a percentage.',
      calculation: [
        'Calculate Annual Cash Flow',
        'Divide by Total Cash Invested (Down Payment + Closing Costs)',
        'Multiply by 100 to get percentage',
        'Cash-on-Cash = (Annual Cash Flow ÷ Cash Invested) × 100'
      ],
      insights: [
        'Higher cash-on-cash returns indicate better investment performance',
        'Target 8-12% cash-on-cash return for residential properties',
        'Leverage (using loans) can increase cash-on-cash returns',
        'Compare with stock market returns (typically 7-10% annually)'
      ],
      icon: <PercentIcon />,
      getActualCalculation: (results, formData) => {
        const cashFlow = results.CashFlow;
        const cashInvested = formData.down_payment; // Assuming no closing costs for simplicity
        const cashOnCash = (cashFlow / cashInvested) * 100;
        
        return {
          steps: [
            `Annual Cash Flow = ${formatCurrency(cashFlow)}`,
            `Cash Invested = ${formatCurrency(cashInvested)}`,
            `Cash-on-Cash = (${formatCurrency(cashFlow)} ÷ ${formatCurrency(cashInvested)}) × 100`,
            `Cash-on-Cash = ${cashOnCash.toFixed(1)}%`
          ],
          finalValue: `${cashOnCash.toFixed(1)}%`
        };
      }
    },
    NPV: {
      title: 'Net Present Value',
      definition: 'The present value of all future cash flows from the investment, discounted to today\'s dollars.',
      calculation: [
        'Project future cash flows for the investment period',
        'Apply discount rate (typically 8-12%) to each future cash flow',
        'Sum all discounted cash flows',
        'Subtract initial investment amount',
        'NPV = Sum of Discounted Cash Flows - Initial Investment'
      ],
      insights: [
        'Positive NPV indicates a profitable investment',
        'Higher discount rates make future cash flows less valuable',
        'Compare NPV across different investment opportunities',
        'Consider risk-adjusted discount rates for different property types'
      ],
      icon: <MoneyIcon />,
      getActualCalculation: (results, formData) => {
        const discountRate = 0.10; // 10% discount rate
        const cashFlow = results.CashFlow;
        const years = formData.years;
        let npv = -formData.down_payment; // Initial investment (negative)
        
        // Add discounted cash flows
        for (let year = 1; year <= years; year++) {
          npv += cashFlow / Math.pow(1 + discountRate, year);
        }
        
        return {
          steps: [
            `Initial Investment = -${formatCurrency(formData.down_payment)}`,
            `Annual Cash Flow = ${formatCurrency(cashFlow)}`,
            `Discount Rate = ${(discountRate * 100).toFixed(1)}%`,
            `NPV = -${formatCurrency(formData.down_payment)} + ${formatCurrency(cashFlow)}/(1.1) + ${formatCurrency(cashFlow)}/(1.1)² + ... + ${formatCurrency(cashFlow)}/(1.1)^${years}`,
            `NPV = ${formatCurrency(npv)}`
          ],
          finalValue: formatCurrency(npv)
        };
      }
    },
    IRR: {
      title: 'Internal Rate of Return',
      definition: 'The annualized rate of return that makes the net present value of all cash flows equal to zero.',
      calculation: [
        'Set up the NPV equation with IRR as the unknown rate',
        'Use iterative methods or financial calculators to solve',
        'IRR is the rate where: NPV = 0',
        'Consider all cash flows: purchase, income, expenses, and sale'
      ],
      insights: [
        'Higher IRR indicates better investment performance',
        'Target IRR: 12-15% for residential, 15-20% for commercial',
        'IRR accounts for time value of money better than simple returns',
        'Compare IRR with your required rate of return'
      ],
      icon: <PercentIcon />,
      getActualCalculation: (results, formData) => {
        const irr = results.IRR;
        
        return {
          steps: [
            `IRR is calculated using iterative methods`,
            `It's the rate where NPV = 0`,
            `For this investment, IRR = ${formatPercent(irr)}`,
            `This represents the annualized return on your investment`
          ],
          finalValue: formatPercent(irr)
        };
      }
    },
    StockValue: {
      title: 'Stock Investment Value',
      definition: 'The projected value of investing the same amount in the stock market over the same time period.',
      calculation: [
        'Start with the cash invested (down payment)',
        'Apply compound interest formula: FV = PV × (1 + r)^n',
        'Where: FV = Future Value, PV = Present Value, r = Annual Return Rate, n = Years',
        'Stock Value = Down Payment × (1 + Stock Return Rate)^Years'
      ],
      insights: [
        'Stock investments offer liquidity and diversification',
        'Historical S&P 500 returns average 10-11% annually',
        'Stocks require less active management than real estate',
        'Consider tax advantages of real estate vs. stock investments'
      ],
      icon: <TrendingUpIcon />,
      getActualCalculation: (results, formData) => {
        const stockValue = formData.down_payment * Math.pow(1 + formData.stock_return_rate / 100, formData.years);
        
        return {
          steps: [
            `Initial Investment = ${formatCurrency(formData.down_payment)}`,
            `Annual Return Rate = ${formData.stock_return_rate}%`,
            `Investment Period = ${formData.years} years`,
            `Stock Value = ${formatCurrency(formData.down_payment)} × (1 + ${formData.stock_return_rate / 100})^${formData.years}`,
            `Stock Value = ${formatCurrency(stockValue)}`
          ],
          finalValue: formatCurrency(stockValue)
        };
      }
    }
  };

  const handleCardClick = (metricKey: string) => {
    setOpenDialog(metricKey);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  if (!results) {
    return (
      <Paper elevation={0} sx={{ p: 4, backgroundColor: '#fff' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Investment Analysis
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AccountBalanceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Enter investment parameters and click "Calculate Investment" to see your analysis
          </Typography>
        </Box>
      </Paper>
    );
  }

  const getChipColor = (value: number, type: string) => {
    if (type === 'capRate') {
      return value >= 6 ? 'success' : value >= 4 ? 'warning' : 'error';
    }
    if (type === 'cashFlow') {
      return value > 0 ? 'success' : 'error';
    }
    if (type === 'irr') {
      return value >= 8 ? 'success' : value >= 6 ? 'warning' : 'error';
    }
    return 'default';
  };

  const kpiCards = [
    {
      key: 'monthly_payment',
      title: 'Monthly mortgage payment',
      value: formatCurrency(results.monthly_payment),
      icon: <MoneyIcon />,
      color: 'default' as const
    },
    {
      key: 'NOI',
      title: 'Net Operating Income',
      value: formatCurrency(results.NOI),
      icon: <AccountBalanceIcon />,
      color: 'success' as const
    },
    {
      key: 'CapRate',
      title: 'Capitalization Rate',
      value: formatPercent(results.CapRate),
      icon: <PercentIcon />,
      color: getChipColor(results.CapRate, 'capRate') as any
    },
    {
      key: 'CashFlow',
      title: 'Annual cash flow',
      value: formatCurrency(results.CashFlow),
      icon: <TrendingUpIcon />,
      color: getChipColor(results.CashFlow, 'cashFlow') as any
    },
    {
      key: 'CashOnCash',
      title: 'Cash-on-cash return',
      value: `${results.CashOnCash.toFixed(1)}%`,
      icon: <PercentIcon />,
      color: 'default' as const
    },
    {
      key: 'NPV',
      title: 'Net Present Value',
      value: formatCurrency(results.NPV),
      icon: <MoneyIcon />,
      color: 'default' as const
    },
    {
      key: 'IRR',
      title: 'Internal Rate of Return',
      value: formatPercent(results.IRR),
      icon: <PercentIcon />,
      color: getChipColor(results.IRR, 'irr') as any
    }
  ];

  return (
    <Paper elevation={0} sx={{ p: 4, backgroundColor: '#fff' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Investment Analysis
      </Typography>

      {/* Real Estate Investment */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
        <HomeIcon sx={{ mr: 1 }} />
        Real Estate Investment
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiCards.map((card) => (
          <Grid item xs={12} sm={6} key={card.key}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => handleCardClick(card.key)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: 'primary.main', mr: 1 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                  {card.value}
                </Typography>
                <Chip 
                  label={card.color === 'success' ? 'Good' : card.color === 'warning' ? 'Fair' : card.color === 'error' ? 'Poor' : 'Neutral'}
                  color={card.color}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Stock Market Comparison */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
        <TrendingUpIcon sx={{ mr: 1 }} />
        Stock Market Comparison
      </Typography>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
            borderColor: 'primary.main'
          }
        }}
        onClick={() => handleCardClick('StockValue')}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              Stock investment value
            </Typography>
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
            {formatCurrency(results.StockValue)}
          </Typography>
          <Chip label="Stock Investment" color="primary" size="small" />
        </CardContent>
      </Card>

      <InvestmentCharts results={results} formData={formData} />

      {/* LLM Recommendation */}
      {llmResponse && (
        <Alert 
          icon={<CheckCircleIcon />} 
          severity="success" 
          sx={{ mt: 2 }}
        >
          {llmResponse}
        </Alert>
      )}

      {/* Summary Message */}
      {results.CashFlow > 0 && (
        <Alert 
          icon={<InfoIcon />} 
          severity="info" 
          sx={{ mt: 2 }}
        >
          This investment generates {formatCurrency(results.CashFlow)} in positive cash flow annually.
        </Alert>
      )}

      {/* Metric Information Dialog */}
      <Dialog 
        open={!!openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {openDialog && metricInfo[openDialog] && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              {metricInfo[openDialog].icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {metricInfo[openDialog].title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Definition</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    {metricInfo[openDialog].definition}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <CalculateIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Calculation Steps</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {metricInfo[openDialog].calculation.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {formData && metricInfo[openDialog].getActualCalculation && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CalculateIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Your Calculation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Final Result: {metricInfo[openDialog].getActualCalculation!(results, formData).finalValue}
                      </Typography>
                    </Box>
                    <List dense>
                      {metricInfo[openDialog].getActualCalculation!(results, formData).steps.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <LightbulbIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Optimization Insights</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {metricInfo[openDialog].insights.map((insight, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={insight} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default KPISummary; 