
// Define global variables
const totalPages = 2000; // You should determine the total number of pages based on the available data.
let currentPage = 1; // The initial page.

async function fetchMarvelCharacters(page) {
    const publicKey = 'fe30a8eb0db9660122bb4ebcb06b4d8c';
    const privateKey = 'c09d6998cf36b3573a2d1f26c3fa47fc20919c76';
    const baseURL = 'https://gateway.marvel.com/v1/public/characters';
    const limit = 10; // Number of characters per page

    try {
        const timestamp = new Date().getTime().toString();
        const hashInput = timestamp + privateKey + publicKey;
        const md5Hash = CryptoJS.MD5(hashInput).toString();

        const offset = (page - 1) * limit;

        const response = await fetch(`${baseURL}?apikey=${publicKey}&ts=${timestamp}&hash=${md5Hash}&limit=${limit}&offset=${offset}`);
        const data = await response.json();

        if (data && data.data && data.data.results) {
            return data.data.results;
        } else {
            console.error('Error: Invalid data format received from Marvel API.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        return [];
    }
}
// Function to populate the HTML table with characters
function populateMarvelTable(characters) {
    const tableBody = document.querySelector('#marvelTable tbody');
    tableBody.innerHTML = ''; // Clear the existing table content.

    characters.forEach(character => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${character.name}</td>
            <td>${character.description}</td>
            <td><img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"></td>
            <!-- Add more columns as needed -->
        `;
        tableBody.appendChild(row);
    });
}

// Function to update the pagination controls
function updatePagination() {
    const prevButton = document.querySelector('#prevPage');
    const nextButton = document.querySelector('#nextPage');
    const pageIndicator = document.querySelector('#currentPage');

    pageIndicator.textContent = currentPage;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Event listener for previous page button
document.querySelector('#prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndPopulateMarvelData(currentPage);
    }
});

// Event listener for next page button
document.querySelector('#nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchAndPopulateMarvelData(currentPage);
    }
});

// Initial data fetch and table population
async function fetchAndPopulateMarvelData(page) {
    const characters = await fetchMarvelCharacters(page);
    populateMarvelTable(characters);
    updatePagination();
}

// Call the function to fetch and populate data for the initial page
fetchAndPopulateMarvelData(currentPage);
