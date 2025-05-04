const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchresult = document.getElementById("search-results");
const showmore = document.getElementById("show-more");

// Add a debug element
const debugElement = document.createElement("div");
debugElement.id = "debug-info";
debugElement.style.cssText = "background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 4px; font-family: monospace; font-size: 12px; display: none;";
document.body.insertBefore(debugElement, document.querySelector("footer"));

// Function to toggle debug mode
function toggleDebug() {
  const debugArea = document.getElementById("debug-info");
  debugArea.style.display = debugArea.style.display === "none" ? "block" : "none";
}

// Add debug button
const debugButton = document.createElement("button");
debugButton.textContent = "Toggle Debug Info";
debugButton.style.cssText = "position: fixed; bottom: 10px; right: 10px; padding: 5px; font-size: 12px; background: #f1f1f1; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;";
document.body.appendChild(debugButton);
debugButton.addEventListener("click", toggleDebug);

// Debug log function
function debugLog(message) {
  console.log(message);
  const debugArea = document.getElementById("debug-info");
  const logEntry = document.createElement("div");
  logEntry.innerHTML = `<span style="color:#888;">${new Date().toISOString().substr(11, 8)}</span> ${message}`;
  debugArea.appendChild(logEntry);
  
  // Keep only the last 20 messages
  if (debugArea.children.length > 20) {
    debugArea.removeChild(debugArea.children[0]);
  }
}

let keyword = "";
let page = 1;

// API URL using the Vercel API route
const API_URL = "/api/search-images";

async function searchImages() {
  keyword = searchBox.value.trim();
  
  if (!keyword) {
    searchresult.innerHTML = '<p>Please enter a search term</p>';
    showmore.style.display = "none";
    return;
  }
  
  const url = `${API_URL}?query=${encodeURIComponent(keyword)}&page=${page}`;
  debugLog(`Fetching from: ${url}`);
  
  try {
    // Show loading state
    if (page === 1) {
      searchresult.innerHTML = '<p class="loading">Loading...</p>';
    }
    
    // Disable the show more button while loading
    if (showmore) {
      showmore.disabled = true;
    }
    
    // Fetch with detailed error handling
    const response = await fetch(url);
    debugLog(`Response status: ${response.status} ${response.statusText}`);
    
    // Re-enable the show more button
    if (showmore) {
      showmore.disabled = false;
    }
    
    // Check if the response is OK
    if (!response.ok) {
      // Try to get error details
      let errorDetail = "";
      try {
        const errorText = await response.text();
        debugLog(`Error response: ${errorText.substring(0, 100)}...`);
        errorDetail = errorText.includes('<!DOCTYPE') 
          ? 'Server returned HTML instead of JSON (likely a 404 page)' 
          : errorText;
      } catch (e) {
        errorDetail = "Could not read error details";
      }
      
      throw new Error(`Server error ${response.status}: ${errorDetail}`);
    }
    
    // Parse response as JSON with extra error handling
    let data;
    try {
      const responseText = await response.text();
      debugLog(`Response first 100 chars: ${responseText.substring(0, 100)}...`);
      data = JSON.parse(responseText);
    } catch (e) {
      debugLog(`JSON parse error: ${e.message}`);
      throw new Error(`Failed to parse response as JSON: ${e.message}`);
    }
    
    // Validate response structure
    if (!data) {
      throw new Error("Empty response received");
    }
    
    debugLog(`Received ${data.results?.length || 0} results`);
    
    // Check if results are available
    if (!data.results || data.results.length === 0) {
      if (page === 1) {
        searchresult.innerHTML = '<p>No images found. Try a different search term.</p>';
      } else {
        // No more results
        showmore.style.display = "none";
      }
      return;
    }
    
    // Clear previous results if this is the first page
    if (page === 1) {
      searchresult.innerHTML = '';
    }
    
    // Process and display the images
    data.results.forEach((result) => {
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || 'Unsplash image';
      
      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      
      imageLink.appendChild(image);
      searchresult.appendChild(imageLink);
    });
    
    // Show the button to load more results
    showmore.style.display = "block";
    
  } catch (error) {
    console.error('Error in searchImages:', error);
    debugLog(`Error: ${error.message}`);
    
    if (page === 1) {
      searchresult.innerHTML = `
        <p class="error">Something went wrong: ${error.message}</p>
        <p>Please check the browser console for more details.</p>
      `;
    } else {
      // Append error message if loading more
      const errorMsg = document.createElement('p');
      errorMsg.className = 'error';
      errorMsg.textContent = `Failed to load more images: ${error.message}`;
      searchresult.appendChild(errorMsg);
    }
    
    // Re-enable the button
    if (showmore) {
      showmore.disabled = false;
    }
  }
}

// Check API health on page load
async function checkApiHealth() {
  try {
    debugLog("Checking API health...");
    const response = await fetch("/api");
    
    if (response.ok) {
      const data = await response.json();
      debugLog(`API Status: ${data.status}`);
    } else {
      debugLog(`API check failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    debugLog(`API health check error: ${error.message}`);
  }
}

// Set up event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1; // Reset to first page
  searchImages();
});

showmore.addEventListener("click", () => {
  page++;
  searchImages();
});

// Hide the "Show More" button initially
showmore.style.display = "none";

// Run initial API health check
window.addEventListener('load', checkApiHealth);