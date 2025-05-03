// server.js (Node.js with Express)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Allow cross-origin requests from the frontend
app.use(cors());

// Your Unsplash API Key stored in .env
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.get('/search-images', async (req, res) => {
  const { query, page = 1 } = req.query;

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page,
        client_id: ACCESS_KEY,
        per_page: 12,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
