const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Serve static files from the current directory
app.use(express.static(__dirname));

// Your Unsplash API Key stored in .env
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'API is running' });
});

// API endpoint for image search - FIXED to match the frontend URL
app.get('/api/search-images', async (req, res) => {
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

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add a catch-all route to handle 404s with JSON response instead of HTML
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});