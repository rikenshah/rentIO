import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

interface InvestmentChartsProps {
  results: any;
  formData: any;
}

interface TimePoint {
  year: number;
  cashFlow: number;
  equity: number;
  stockValue: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const InvestmentCharts: React.FC<InvestmentChartsProps> = ({ results, formData }) => {
  if (!results || !formData) return null;

  const timeSeries = generateTimeSeriesData(formData, results);

  const finalEquity = timeSeries[timeSeries.length - 1].equity;
  const totalCashFlow = results.CashFlow * formData.years;
  const equityGain = finalEquity - formData.down_payment;
  const stockProfit = results.StockValue - formData.down_payment;

  const breakdown = [
    { name: 'Cash Flow', value: totalCashFlow },
    { name: 'Equity Gain', value: equityGain },
    { name: 'Stock Profit', value: stockProfit }
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Investment Performance Over Time
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cashFlow" name="Cumulative Cash Flow" stroke={COLORS[0]} />
            <Line type="monotone" dataKey="equity" name="Equity" stroke={COLORS[1]} />
            <Line type="monotone" dataKey="stockValue" name="Stock Value" stroke={COLORS[2]} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ width: '100%', height: 300, mt: 4, display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 250, height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {breakdown.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ flex: 1, minWidth: 250, height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={80} label>
                {breakdown.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

function generateTimeSeriesData(formData: any, results: any): TimePoint[] {
  const years = formData.years;
  const monthlyRate = formData.interest_rate / 100 / 12;
  const monthlyPayment = results.monthly_payment;
  let balance = formData.loan_amount;
  const data: TimePoint[] = [];

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
    }
    const propertyValue = formData.purchase_price * Math.pow(1 + formData.appreciation_rate / 100, year);
    const equity = propertyValue - balance;

    data.push({
      year,
      cashFlow: results.CashFlow * year,
      equity,
      stockValue: formData.down_payment * Math.pow(1 + formData.stock_return_rate / 100, year)
    });
  }

  return data;
}

export default InvestmentCharts;
