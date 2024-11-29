const API_BASE_URL = '/api/solana';

    // Request timeout utility
    const timeout = (promise, ms = 5000) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), ms)
        )
      ]);
    };

    // Reusable fetch with error handling and timeout
    const fetchWithTimeout = async (endpoint, options = {}) => {
      try {
        const response = await timeout(
          fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers
            }
          })
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
    };

    // API methods with request deduplication
    const pendingRequests = new Map();

    export const fetchData = async (endpoint, options = {}) => {
      const requestKey = `${endpoint}-${JSON.stringify(options)}`;

      if (pendingRequests.has(requestKey)) {
        return pendingRequests.get(requestKey);
      }

      const request = fetchWithTimeout(endpoint, options);
      pendingRequests.set(requestKey, request);

      try {
        const response = await request;
        pendingRequests.delete(requestKey);
        return response;
      } catch (error) {
        pendingRequests.delete(requestKey);
        throw error;
      }
    };
