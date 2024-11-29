import React, { useState, useEffect } from 'react';
    import {
      Card,
      CardContent,
      Typography,
      Grid,
      TextField,
      Button,
      Box,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      Paper
    } from '@mui/material';
    import {
      PieChart,
      Pie,
      Cell,
      ResponsiveContainer,
      Tooltip,
      Legend
    } from 'recharts';

    const COLORS = ['#00C49F', '#FF8042', '#0088FE'];

    const PnLView = ({ tokenAddress }) => {
      const [walletAddress, setWalletAddress] = useState('');
      const [pnlData, setPnlData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchPnLData = async () => {
        if (!tokenAddress || !walletAddress) return;

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/solana/pnl/${walletAddress}/${tokenAddress}`);
          const data = await response.json();
          setPnlData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      };

      const formatPercentage = (value) => {
        return `${(value * 100).toFixed(2)}%`;
      };

      const getPieChartData = () => {
        if (!pnlData) return [];

        return [
          {
            name: 'Realized Gains',
            value: Math.max(0, pnlData.realizedPnl)
          },
          {
            name: 'Unrealized Gains',
            value: Math.max(0, pnlData.unrealizedPnl)
          },
          {
            name: 'Total Invested',
            value: pnlData.totalInvested
          }
        ];
      };

      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profit and Loss Analysis
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Wallet Address"
                  variant="outlined"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={fetchPnLData}
                  disabled={!tokenAddress || !walletAddress}
                >
                  Fetch PnL Data
                </Button>
              </Grid>
            </Grid>

            {loading && (
              <Typography>Loading PnL data...</Typography>
            )}

            {error && (
              <Typography color="error">Error: {error}</Typography>
            )}

            {pnlData && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Invested</TableCell>
                          <TableCell align="right">{formatCurrency(pnlData.totalInvested)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Current Value</TableCell>
                          <TableCell align="right">{formatCurrency(pnlData.currentValue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Realized PnL</TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: pnlData.realizedPnl >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatCurrency(pnlData.realizedPnl)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Unrealized PnL</TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: pnlData.unrealizedPnl >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatCurrency(pnlData.unrealizedPnl)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ROI</TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: pnlData.roi >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatPercentage(pnlData.roi)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Average Cost Basis</TableCell>
                          <TableCell align="right">{formatCurrency(pnlData.costBasis)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieChartData()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      );
    };

    export default PnLView;
