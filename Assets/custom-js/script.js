const publicKey = 'fe30a8eb0db9660122bb4ebcb06b4d8c';
        const privateKey = 'c09d6998cf36b3573a2d1f26c3fa47fc20919c76';
        const baseURL = 'https://gateway.marvel.com/v1/public/characters';

        // Function to generate a hash for the API request
        function generateHash(timestamp) {
            return md5(`${timestamp}${privateKey}${publicKey}`);
        }

        // Function to fetch character data and update the HTML elements
        function fetchCharacterData(characterName) {
            const timestamp = new Date().getTime();
            const hash = generateHash(timestamp);

            $.ajax({
                url: `${baseURL}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&name=${characterName}`,
                method: 'GET',
                success: function (response) {
                    const character = response.data.results[0];
                    if (character) {
                        // Update the HTML elements with character data
                        $('h2').text(character.name);
                        $('p').text(character.description);
                    } else {
                        $('h2').text('Character not found');
                        $('p').text('');
                    }
                },
                error: function () {
                    $('h2').text('Error fetching data');
                    $('p').text('');
                }
            });
        }

        // Call the function to fetch data for a specific character (e.g., Spider-Man)
        fetchCharacterData('Spider-Man');