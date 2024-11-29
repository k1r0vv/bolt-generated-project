import React, { useState, useEffect } from 'react';
    import {
      Card,
      CardContent,
      Typography,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      Paper,
      Box,
      Select,
      MenuItem,
      FormControl,
      InputLabel,
      TextField,
      IconButton,
      Tooltip,
      Chip
    } from '@mui/material';
    import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip as RechartsTooltip,
      Legend,
      ResponsiveContainer
    } from 'recharts';

    const TopTradersView = ({ tokenAddress }) => {
      const [tradersData, setTradersData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [sortBy, setSortBy] = useState('totalPnl');
      const [filterBy, setFilterBy] = useState('all');

      const fetchTradersData = async () => {
        if (!tokenAddress) return;

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/solana/top-traders/${tokenAddress}`);
          const data = await response.json();
          setTradersData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchTradersData();
      }, [tokenAddress]);

      const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      };

      const formatPercentage = (value) => {
        return `${(value * 100).toFixed(2)}%`;
      };

      const formatWalletAddress = (address) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
      };

      const getFilteredAndSortedData = () => {
        if (!tradersData) return [];

        let filtered = [...tradersData];

        // Apply filters
        if (filterBy === 'profitable') {
          filtered = filtered.filter(trader => trader.totalPnl > 0);
        } else if (filterBy === 'unprofitable') {
          filtered = filtered.filter(trader => trader.totalPnl < 0);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          if (sortBy === 'totalPnl') {
            return b.totalPnl - a.totalPnl;
          } else if (sortBy === 'roi') {
            return b.roi - a.roi;
          }
          return b.totalVolume - a.totalVolume;
        });

        return filtered;
      };

      const getChartData = () => {
        const filtered = getFilteredAndSortedData().slice(0, 10);
        return filtered.map(trader => ({
          wallet: formatWalletAddress(trader.walletAddress),
          realizedPnl: trader.realizedPnl,
          unrealizedPnl: trader.unrealizedPnl
        }));
      };

      return (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Top Traders</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="totalPnl">Total PnL</MenuItem>
                    <MenuItem value="roi">ROI</MenuItem>
                    <MenuItem value="volume">Volume</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterBy}
                    label="Filter"
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <MenuItem value="all">All Traders</MenuItem>
                    <MenuItem value="profitable">Profitable</MenuItem>
                    <MenuItem value="unprofitable">Unprofitable</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading && <Typography>Loading top traders data...</Typography>}
            {error && <Typography color="error">Error: {error}</Typography>}

            {tradersData && (
              <>
                {/* Performance Chart */}
                <Box sx={{ height: 300, mb: 4 }}>
                  <ResponsiveContainer>
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="wallet" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <RechartsTooltip 
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar dataKey="realizedPnl" name="Realized PnL" fill="#8884d8" />
                      <Bar dataKey="unrealizedPnl" name="Unrealized PnL" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* Traders Table */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Wallet</TableCell>
                        <TableCell align="right">Total PnL</TableCell>
                        <TableCell align="right">Realized PnL</TableCell>
                        <TableCell align="right">Unrealized PnL</TableCell>
                        <TableCell align="right">ROI</TableCell>
                        <TableCell align="right">Volume</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredAndSortedData().map((trader) => (
                        <TableRow key={trader.walletAddress}>
                          <TableCell>
                            <Tooltip title={trader.walletAddress}>
                              <span>{formatWalletAddress(trader.walletAddress)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: trader.totalPnl >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatCurrency(trader.totalPnl)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: trader.realizedPnl >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatCurrency(trader.realizedPnl)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: trader.unrealizedPnl >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatCurrency(trader.unrealizedPnl)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: trader.roi >= 0 ? 'success.main' : 'error.main' }}
                          >
                            {formatPercentage(trader.roi)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(trader.totalVolume)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={trader.totalPnl >= 0 ? 'Profitable' : 'Loss'} 
                              color={trader.totalPnl >= 0 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      );
    };

    export default TopTradersView;
