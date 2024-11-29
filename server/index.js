const express = require('express');
    const cors = require('cors');
    const helmet = require('helmet');
    const compression = require('compression');
    const dotenv = require('dotenv');
    const path = require('path');

    // Load environment variables
    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;
    const isProduction = process.env.NODE_ENV === 'production';

    // Verify API key is available
    if (!process.env.SOLANA_TRACKER_API_KEY) {
      console.error('SOLANA_TRACKER_API_KEY is not set in environment variables');
      process.exit(1);
    }

    // Security and optimization middleware
    app.use(helmet());
    app.use(compression());
    app.use(cors({
      origin: isProduction 
        ? process.env.CLIENT_URL 
        : 'http://localhost:4567',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json({ limit: '10kb' }));

    // Serve static files in production
    if (isProduction) {
      app.use(express.static(path.join(__dirname, '../client/dist')));
    }

    // API routes
    app.get('/api/solana/tokens/:tokenAddress', async (req, res) => {
      try {
        const response = await fetch(
          `https://public-api.solana.tracker/v1/tokens/${req.params.tokenAddress}`,
          {
            headers: {
              'x-api-key': process.env.SOLANA_TRACKER_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        res.json(data);
      } catch (error) {
        res.status(500).json({
          error: 'API Error',
          message: 'Failed to fetch token data'
        });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    // Serve React app in production
    if (isProduction) {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });
