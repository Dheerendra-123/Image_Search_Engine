const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchresult = document.getElementById("search-results");
const showmore = document.getElementById("show-more");

let keyword = "";
let page = 1;

// Update the API endpoint to use the /api route on Vercel
const API_URL = "/api/search-images";

async function searchImages() {
    keyword = searchBox.value.trim();
    
    if (!keyword) {
        searchresult.innerHTML = '<p>Please enter a search term</p>';
        showmore.style.display = "none";
        return;
    }
    
    const url = `${API_URL}?query=${encodeURIComponent(keyword)}&page=${page}`;
    
    try {
        // Show loading state
        if (page === 1) {
            searchresult.innerHTML = '<p class="loading">Loading...</p>';
        }
        
        // Disable the show more button while loading
        if (showmore) {
            showmore.disabled = true;
        }
        
        console.log(`Fetching from: ${url}`);
        const response = await fetch(url);
        
        // Re-enable the show more button
        if (showmore) {
            showmore.disabled = false;
        }
        
        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} - ${errorText}`);
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
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
        
        if (page === 1) {
            searchresult.innerHTML = `
                <p class="error">Something went wrong: ${error.message}</p>
                <p>Please try again later.</p>
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

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1; // Reset to first page
    searchImages();
});

showmore.addEventListener("click", () => {
    page++;
    searchImages();
});

// Add some basic styles for error and loading states
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        color: #666;
    }
    .error {
        color: #d32f2f;
        text-align: center;
    }
`;
document.head.appendChild(style);