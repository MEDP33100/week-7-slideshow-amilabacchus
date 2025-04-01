//array to store artworks
let artworks = [];

//current index of displayed art
let currentIndex = 0;

//function to fetch art from The MET Museum API
async function fetchArtworks() {
    try {
        //fetches search results for paintings
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=painting`);
        const { objectIDs } = await response.json();

        //checks if any artworks were found
        if (!objectIDs?.length) {
            console.error("No artworks found.");
            return;
        }

        //selects the first 5 artwork IDs
        const selectedIDs = objectIDs.slice(0, 5);

        //fetches details for selected artworks
        const fetchPromises = selectedIDs.map(id =>
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
        );

        //stores fetched artwork details in array
        artworks = await Promise.all(fetchPromises);

        //displays the artwork
        displayArtwork(currentIndex);
    } catch (error) {
        console.error("Error fetching artworks:", error);
    }
}

//function to display artwork at given index
function displayArtwork(index) {
    const artworkContainer = document.getElementById("artworkContainer");
    artworkContainer.innerHTML = ""; //clears previous art 

    const artwork = artworks[index];
    if (!artwork?.primaryImage) return; //checks if artwork and image exist

    //creates and styles image element
    const img = document.createElement("img");
    img.src = artwork.primaryImage;
    img.alt = artwork.title;
    img.style.maxWidth = "80%";

    //creates and styles title element
    const title = document.createElement("p");
    title.textContent = artwork.title;

    //appends image and title to the container
    artworkContainer.appendChild(img);
    artworkContainer.appendChild(title);
}

//event listener for prev button
document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    displayArtwork(currentIndex);
});

//event listener for next button
document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % artworks.length;
    displayArtwork(currentIndex);
});

//fetch and display artwork
fetchArtworks();