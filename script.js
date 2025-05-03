const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchresult = document.getElementById("search-results");
const showmore = document.getElementById("show-more");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value;
    const url = `http://localhost:5000/search-images?query=${keyword}&page=${page}`;

    try {
        const response = await fetch(url);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch from backend');
        }

        const data = await response.json();

        // Check if results are available in the response
        if (!data.results || data.results.length === 0) {
            console.error('No images found');
            return;
        }

        const results = data.results;

        results.map((result) => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchresult.appendChild(imageLink);
        });

        showmore.style.display = "block";

    } catch (error) {
        console.error('Error in searchImages:', error);
        alert('Something went wrong. Please try again later.');
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

showmore.addEventListener("click", (e) => {
    page++;
    searchImages();
});
