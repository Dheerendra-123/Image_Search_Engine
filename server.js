const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());

// Your Unsplash API Key stored in .env
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.get('/search-images', async (req, res) => {
    const { query, page = 1 } = req.query;

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

        // Log Unsplash API response
        // console.log(response.data);

        res.json(response.data); // Forward the result to the frontend
    } catch (error) {
        console.error('Error fetching from Unsplash:', error.message);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
