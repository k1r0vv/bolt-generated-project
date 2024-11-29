import React from 'react';
    import { Box, CircularProgress, Typography } from '@mui/material';

    const LoadingOverlay = ({ message = 'Loading...' }) => (
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
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );

    export default LoadingOverlay;
