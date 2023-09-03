async function fetchAllMarvelCharacters() {
    const publicKey = 'fe30a8eb0db9660122bb4ebcb06b4d8c';
    const privateKey = 'c09d6998cf36b3573a2d1f26c3fa47fc20919c76';
    const baseURL = 'https://gateway.marvel.com/v1/public/characters';
    const limit = 20; // Number of characters per page
    let offset = 0; // Initial offset

    try {
        const timestamp = new Date().getTime().toString();
        const hashInput = timestamp + privateKey + publicKey;
        const md5Hash = CryptoJS.MD5(hashInput).toString();

        let allCharacters = []; // Array to store all characters

        let data; // Define data variable to store the response

        // Fetch characters until all are retrieved
        do {
            const response = await fetch(`${baseURL}?apikey=${publicKey}&ts=${timestamp}&hash=${md5Hash}&limit=${limit}&offset=${offset}`);
            data = await response.json(); 
            // Check if the data is received as expected
            if (data && data.data && data.data.results) {
                // Append characters from this page to the array
                allCharacters = allCharacters.concat(data.data.results);
            } else {
                console.error('Error: Invalid data format received from Marvel API.');
                break;
            }

            offset += limit; // Increment the offset for the next page
        } while (offset < data.data.total); // Continue fetching until all characters are retrieved

        // Now, allCharacters contains all Marvel characters

        populateMarvelTable(allCharacters);

    } catch (error) {
        console.error('Error fetching Marvel data:', error);
    }
}
// Function to populate the HTML table with the fetched data
function populateMarvelTable(allCharacters) {
    const tableBody = document.querySelector('#marvelTable tbody');
    console.log(allCharacters);
    allCharacters.forEach(character => {
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

// Call the function to fetch all characters
fetchAllMarvelCharacters();

