import React, { useState, useEffect } from 'react';
    import {
      Card,
      CardContent,
      Typography,
      Grid,
      ButtonGroup,
      Button,
      Box,
      Paper
    } from '@mui/material';
    import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
      Legend,
      ResponsiveContainer,
      PieChart,
      Pie,
      Cell
    } from 'recharts';

    const TIME_INTERVALS = [
      { label: '1H', value: '1h' },
      { label: '24H', value: '24h' },
      { label: '7D', value: '7d' }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FF8042', '#8884d8'];

    const StatsView = ({ tokenAddress }) => {
      const [selectedInterval, setSelectedInterval] = useState('24h');
      const [statsData, setStatsData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchStatsData = async () => {
        if (!tokenAddress) return;

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/solana/stats/${tokenAddress}?interval=${selectedInterval}`);
          const data = await response.json();
          setStatsData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchStatsData();
      }, [tokenAddress, selectedInterval]);

      const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US').format(value);
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

      const getTransactionData = () => {
        if (!statsData) return [];
        return [
          { name: 'Buys', value: statsData.buyCount },
          { name: 'Sells', value: statsData.sellCount }
        ];
      };

      const getVolumeData = () => {
        if (!statsData) return [];
        return [
          { name: 'Buy Volume', value: statsData.buyVolume },
          { name: 'Sell Volume', value: statsData.sellVolume }
        ];
      };

      return (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Token Statistics</Typography>
              <ButtonGroup variant="outlined">
                {TIME_INTERVALS.map(interval => (
                  <Button
                    key={interval.value}
                    onClick={() => setSelectedInterval(interval.value)}
                    variant={selectedInterval === interval.value ? 'contained' : 'outlined'}
                  >
                    {interval.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            {loading && <Typography>Loading statistics...</Typography>}
            {error && <Typography color="error">Error: {error}</Typography>}

            {statsData && (
              <Grid container spacing={3}>
                {/* Key Metrics */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Volume
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(statsData.totalVolume)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Transactions
                        </Typography>
                        <Typography variant="h6">
                          {formatNumber(statsData.totalTransactions)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Active Wallets
                        </Typography>
                        <Typography variant="h6">
                          {formatNumber(statsData.uniqueWallets)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Price Change
                        </Typography>
                        <Typography 
                          variant="h6"
                          color={statsData.priceChange >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatPercentage(statsData.priceChange)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Transaction Distribution Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: 300 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Transaction Distribution
                    </Typography>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={getTransactionData()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {getTransactionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatNumber(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Volume Distribution Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: 300 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Volume Distribution
                    </Typography>
                    <ResponsiveContainer>
                      <BarChart data={getVolumeData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Additional Metrics */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Average Transaction Size
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(statsData.avgTransactionSize)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Buy/Sell Ratio
                        </Typography>
                        <Typography variant="h6">
                          {(statsData.buyCount / statsData.sellCount).toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Holder Change
                        </Typography>
                        <Typography 
                          variant="h6"
                          color={statsData.holderChange >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatNumber(statsData.holderChange)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      );
    };

    export default StatsView;
