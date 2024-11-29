import React, { useState, useEffect } from 'react';
    import { 
      LineChart, 
      Line, 
      XAxis, 
      YAxis, 
      CartesianGrid, 
      Tooltip, 
      ResponsiveContainer,
      Legend 
    } from 'recharts';
    import { 
      Card, 
      CardContent, 
      Typography, 
      ButtonGroup, 
      Button, 
      Box 
    } from '@mui/material';
    import { format } from 'date-fns';

    const TIME_INTERVALS = [
      { label: '1H', value: '1h' },
      { label: '24H', value: '1d' },
      { label: '7D', value: '1w' },
      { label: '30D', value: '1m' },
    ];

    const ChartView = ({ tokenAddress }) => {
      const [chartData, setChartData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [selectedInterval, setSelectedInterval] = useState('1d');

      const fetchChartData = async () => {
        if (!tokenAddress) return;
        
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`/api/solana/chart/${tokenAddress}?interval=${selectedInterval}`);
          const data = await response.json();
          
          // Transform data for Recharts
          const transformedData = data.map(point => ({
            timestamp: new Date(point.timestamp),
            price: point.price,
            volume: point.volume
          }));
          
          setChartData(transformedData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchChartData();
      }, [tokenAddress, selectedInterval]);

      const formatXAxis = (timestamp) => {
        return format(new Date(timestamp), 'HH:mm MMM dd');
      };

      const formatTooltip = (value, name) => {
        if (name === 'price') {
          return [`$${value.toFixed(6)}`, 'Price'];
        }
        return [`$${value.toLocaleString()}`, 'Volume'];
      };

      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Chart
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <ButtonGroup variant="outlined" aria-label="time interval">
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

            {loading && (
              <Typography>Loading chart data...</Typography>
            )}

            {error && (
              <Typography color="error">Error: {error}</Typography>
            )}

            {chartData && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis}
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    scale="time"
                  />
                  <YAxis 
                    yAxisId="left"
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(6)}`}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tickFormatter={(value) => `$${(value/1000000).toFixed(2)}M`}
                  />
                  <Tooltip 
                    labelFormatter={(label) => format(new Date(label), 'PPpp')}
                    formatter={formatTooltip}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8884d8" 
                    dot={false}
                    name="Price"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#82ca9d" 
                    dot={false}
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      );
    };

    export default ChartView;
