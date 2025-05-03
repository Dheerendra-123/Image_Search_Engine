const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the public directory (or your current directory)
// If your files are in the root directory and not in a 'public' folder, use:
app.use(express.static(__dirname));
// Otherwise, if you have a 'public' folder, use:
// app.use(express.static(path.join(__dirname, 'public')));

// Your Unsplash API Key stored in .env
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// API endpoint for image search - using a simple string path, not a regex or pattern
app.get('/search-images', async (req, res) => {
    const { query, page = 1 } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!ACCESS_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        // Log incoming query parameters
        console.log(`Searching for: ${query}, page: ${page}`);

        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                page,
                client_id: ACCESS_KEY,
                per_page: 12,
            },
        });

        res.json(response.data); // Forward the result to the frontend
    } catch (error) {
        console.error('Error fetching from Unsplash:', error.message);
        
        if (error.response) {
            console.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch images',
            message: error.message 
        });
    }
});

// Serve index.html for the root route only, not as a catch-all
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});