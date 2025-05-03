const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchresult = document.getElementById("search-results");
const showmore = document.getElementById("show-more");

let keyword = "";
let page = 1;

// Simple endpoint - no environment detection to minimize complexity
const apiUrl = "/search-images";

async function searchImages() {
    keyword = searchBox.value.trim();
    
    if (!keyword) {
        searchresult.innerHTML = '<p>Please enter a search term</p>';
        showmore.style.display = "none";
        return;
    }
    
    const url = `${apiUrl}?query=${encodeURIComponent(keyword)}&page=${page}`;
    
    try {
        // Show loading indicator
        if (page === 1) {
            searchresult.innerHTML = '<p>Loading...</p>';
        }
        
        const response = await fetch(url);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check if results are available in the response
        if (!data.results || data.results.length === 0) {
            if (page === 1) {
                searchresult.innerHTML = '<p>No images found. Try a different search term.</p>';
            } else {
                showmore.style.display = "none";
            }
            return;
        }
        
        // Clear previous results if this is the first page
        if (page === 1) {
            searchresult.innerHTML = '';
        }
        
        // Process and display results
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
        
        // Show the "Show more" button if we got results
        showmore.style.display = "block";
        
    } catch (error) {
        console.error('Error in searchImages:', error);
        if (page === 1) {
            searchresult.innerHTML = `<p>Something went wrong: ${error.message}</p>`;
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