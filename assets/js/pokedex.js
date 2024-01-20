const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

let offset = 0;
const limit = 12;
const maxRecords = 151;

const convertPokemonToLi = (pokemon) => `
  <li class="pokemon ${pokemon.type}">
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>
    <div class="detail">
      <ol class="types">
        ${pokemon.types
					.map((type) => `<li class="type ${type}">${type}</li>`)
					.join("")}
      </ol>
      <img src="${pokemon.sprite}" alt="${pokemon.name}">
    </div>
  </li>
`;

const loadMorePokemon = async (offset, limit) => {
	try {
		const pokemon = (await pokeApi.getPokemon(offset, limit)) || [];
		const newPokemonList = pokemon.map(convertPokemonToLi).join("");
		pokemonList.innerHTML += newPokemonList;
	} catch (error) {
		console.log(error);
	}
};

loadMorePokemon(offset, limit);

document.addEventListener("click", (event) => {
	if (event.target === loadMoreButton) {
		offset += limit;
		const totalRecordsNextPage = offset + limit;
		if (totalRecordsNextPage >= maxRecords) {
			const newLimit = maxRecords - offset;
			loadMorePokemon(offset, newLimit);
			event.target.parentElement.removeChild(event.target);
		} else {
			loadMorePokemon(offset, limit);
		}
	}
});
