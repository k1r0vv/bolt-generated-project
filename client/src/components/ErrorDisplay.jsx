import React from 'react';
    import { Box, Typography, Button } from '@mui/material';
    import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

    const ErrorDisplay = ({ error, onRetry }) => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Data
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {error}
        </Typography>
        {onRetry && (
          <Button 
            variant="contained" 
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        )}
      </Box>
    );

    export default ErrorDisplay;
