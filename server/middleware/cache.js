import NodeCache from 'node-cache';

    const cache = new NodeCache({ 
      stdTTL: 60, // 1 minute default TTL
      checkperiod: 120 
    });

    export const cacheMiddleware = (duration = 60) => (req, res, next) => {
      const key = req.originalUrl;
      const cachedResponse = cache.get(key);

      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      res.originalJson = res.json;
      res.json = (body) => {
        cache.set(key, body, duration);
        res.originalJson(body);
      };
      
      next();
    };
