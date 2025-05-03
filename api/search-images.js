const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { query, page = 1 } = req.query;
    const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

    if (!ACCESS_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Log incoming query parameters (visible in Vercel logs)
        console.log(`Searching for: ${query}, page: ${page}`);

        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                page,
                client_id: ACCESS_KEY,
                per_page: 12,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from Unsplash:', 
            error.response ? `${error.response.status} ${error.response.statusText}` : error.message);
        
        return res.status(500).json({ 
            error: 'Failed to fetch images',
            message: error.message
        });
    }
};const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { query, page = 1 } = req.query;
    const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

    if (!ACCESS_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Log incoming query parameters (visible in Vercel logs)
        console.log(`Searching for: ${query}, page: ${page}`);

        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                page,
                client_id: ACCESS_KEY,
                per_page: 12,
            },
        });

        if (response.status !== 200) {
            throw new Error(`Unsplash API returned ${response.status} ${response.statusText}`);
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from Unsplash:', 
            error.response ? `${error.response.status} ${error.response.statusText}` : error.message);
        
        return res.status(500).json({ 
            error: 'Failed to fetch images',
            message: error.message
        });
    }
};