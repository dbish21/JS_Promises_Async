// Store all Pokemon data globally
let allPokemon = [];

// 1. Get all Pokemon
function getAllPokemon() {
    return axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => {
            allPokemon = response.data.results;
            return allPokemon;
        });
}

// Helper function to get random Pokemon
function getRandomPokemon(count) {
    const randomPokemon = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allPokemon.length);
        randomPokemon.push(allPokemon[randomIndex]);
    }
    return randomPokemon;
}

// 2 & 3. Get detailed Pokemon data including species
function getPokemonWithSpecies(pokemonUrl) {
    return axios.get(pokemonUrl)
        .then(pokemonResponse => {
            const pokemon = pokemonResponse.data;
            return axios.get(pokemon.species.url)
                .then(speciesResponse => {
                    const englishFlavorText = speciesResponse.data.flavor_text_entries
                        .find(entry => entry.language.name === "en");
                    
                    return {
                        name: pokemon.name,
                        image: pokemon.sprites.front_default,
                        description: englishFlavorText ? englishFlavorText.flavor_text : "No description available"
                    };
                });
        });
}

// 4. UI Functions
function displayPokemon(pokemonData) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = ''; // Clear existing pokemon

    pokemonData.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        card.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.description}</p>
        `;
        
        container.appendChild(card);
    });
}

// Main function to handle button click
function handleGetPokemon() {
    const randomPokemon = getRandomPokemon(3);
    
    Promise.all(randomPokemon.map(pokemon => getPokemonWithSpecies(pokemon.url)))
        .then(pokemonData => {
            displayPokemon(pokemonData);
        })
        .catch(error => {
            console.error("Error fetching Pokemon:", error);
        });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    getAllPokemon()
        .then(() => {
            document.getElementById('get-pokemon').addEventListener('click', handleGetPokemon);
        })
        .catch(error => {
            console.error("Error initializing:", error);
        });
});