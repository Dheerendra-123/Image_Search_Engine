// api/index.js - Root API handler
export default function handler(req, res) {
    res.status(200).json({ 
      status: 'API is running',
      endpoints: ['/api/search-images'],
      message: 'Use /api/search-images with query parameter to search for images'
    });
  }