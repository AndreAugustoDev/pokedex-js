const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
let offset = 0;
const limit = 12;
const maxRecords = 151;

const convertPokemonToLi = (pokemon) => {
	return `
  <li class="pokemon ${pokemon.type}">
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
      <ol class="types">
        ${pokemon.types
					.map((type) => `<li class="type ${type}">${type}</li>`)
					.join("")}
      </ol>

      <img src="${pokemon.sprite}" alt="${pokemon.name}"></img>
    </div>
  </li>
  `;
};

const loadMorePokemons = (offset, limit) => {
	pokeApi
		.getPokemons(offset, limit)
		.then((pokemons = []) => {
			const newPokemonList = pokemons.map(convertPokemonToLi).join("");
			pokemonList.innerHTML += newPokemonList;
		})
		.catch((error) => console.log(error));
};

loadMorePokemons(offset, limit);

loadMoreButton.addEventListener("click", () => {
	offset += limit;
	const quantityRecordNextPage = offset + limit;
	if (quantityRecordNextPage >= maxRecords) {
		const newLimit = maxRecords - offset;
		loadMorePokemons(offset, newLimit);

		loadMoreButton.parentElement.removeChild(loadMoreButton);
	} else {
		loadMorePokemons(offset, limit);
	}
});
