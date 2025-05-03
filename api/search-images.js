// Make sure to install axios: npm install axios
import axios from 'axios';

// This handles the /api/search-images route
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get query parameters
  const { query, page = 1 } = req.query;
  
  // Get API key from environment variables
  const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  // Validate inputs
  if (!ACCESS_KEY) {
    console.error('Missing Unsplash API key');
    return res.status(500).json({ error: 'Server configuration error - API key missing' });
  }

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    console.log(`[Vercel API] Searching for: ${query}, page: ${page}`);
    
    // Make request to Unsplash API
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page,
        client_id: ACCESS_KEY,
        per_page: 12,
      },
    });

    // Log success
    console.log(`Successfully fetched ${response.data.results?.length || 0} images`);
    
    // Return the data
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error('Error fetching from Unsplash:', error.message);
    
    // Log error details if available
    if (error.response) {
      console.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
    }
    
    // Return error response
    return res.status(500).json({ 
      error: 'Failed to fetch images',
      message: error.message 
    });
  }
}