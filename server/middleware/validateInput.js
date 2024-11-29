import { z } from 'zod';

    // Schema definitions for input validation
    const schemas = {
      tokenAddress: z.string()
        .regex(/^[A-Za-z0-9]{32,44}$/, 'Invalid token address format'),
      
      walletAddress: z.string()
        .regex(/^[A-Za-z0-9]{32,44}$/, 'Invalid wallet address format'),
      
      timeInterval: z.enum(['1h', '24h', '7d', '1m'], {
        errorMap: () => ({ message: 'Invalid time interval' })
      }),
    };

    // Middleware for input validation
    export const validateInput = (type) => (req, res, next) => {
      try {
        if (schemas[type]) {
          const value = req.params[type] || req.query[type];
          schemas[type].parse(value);
        }
        next();
      } catch (error) {
        res.status(400).json({
          error: 'Validation Error',
          message: error.errors?.[0]?.message || 'Invalid input'
        });
      }
    };
