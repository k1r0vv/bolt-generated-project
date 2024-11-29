import React, { useState, useEffect } from 'react';
    import {
      Autocomplete,
      TextField,
      CircularProgress,
      Box,
      Typography
    } from '@mui/material';

    const TokenSearch = ({ onTokenSelect }) => {
      const [open, setOpen] = useState(false);
      const [options, setOptions] = useState([]);
      const [inputValue, setInputValue] = useState('');
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        if (!inputValue) return;

        const fetchTokens = async () => {
          setLoading(true);
          try {
            const response = await fetch(`/api/solana/search?q=${inputValue}`);
            const data = await response.json();
            setOptions(data);
          } catch (error) {
            console.error('Error fetching tokens:', error);
          } finally {
            setLoading(false);
          }
        };

        const timeoutId = setTimeout(fetchTokens, 300);
        return () => clearTimeout(timeoutId);
      }, [inputValue]);

      return (
        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          loading={loading}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (newValue) {
              onTokenSelect(newValue.address);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Token"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.name}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.symbol}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        />
      );
    };

    export default TokenSearch;
