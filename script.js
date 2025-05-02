const accessKey="8QxKEIRPeUVbZGp4-KND052OpDH5vnz7oq4S0Azn71A";
const searchForm=document.getElementById("search-form");
const searchBox=document.getElementById("search-box");
const searchresult=document.getElementById("search-results");
const showmore=document.getElementById("show-more");

let keyword ="";
let page =1;

async function searchImages(){
    keyword=searchBox.value;
    const url =`https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
    const response = await fetch(url);
    const data = await response.json();

    const results=data.results;

    results.map((result) =>{
        const image=document.createElement("img");
        image.src=result.urls.small;
        const imageLink=document.createElement("a");
        imageLink.href=result.links.html;
        imageLink.target="_blank";

        imageLink.appendChild(image);
        searchresult.appendChild(imageLink);
    })
    showmore.style.display="block";

}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page=1;
    searchImages();
})

showmore.addEventListener("click", (e) => {
    page++;
    searchImages();
})
