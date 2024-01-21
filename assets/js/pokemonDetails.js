const pokemonDetailsPage = getElement(".pokemonDetails");

const appendPokemonDetails = async (pokemon) => {
	return `
    <div class="pokemon ${pokemon.type}">
      <div class="info">
        <span class="name">${pokemon.name}</span>
        <span class="id">#${pokemon.id}</span>  
      </div>
      <div class="detail">
        <img class="sprite" src="${pokemon.sprite}" alt="${pokemon.name}">
        <ol class="types">
          ${pokemon.types
						.map((type) => `<li class="type ${type}">${type}</li>`)
						.join("")}
        </ol>
				<div class="tabs">
    			<input type="radio" class="tabsRadio" name="tabs" id="about" checked>
    			<label for="about" class="tabsLabel">About</label>
    			<ol class="tabsContent about"></ol>

					<input type="radio" class="tabsRadio" name="tabs" id="stats">
    			<label for="stats" class="tabsLabel">Base Stats</label>
    			<ol class="tabsContent stats"></ol>

					<input type="radio" class="tabsRadio" name="tabs" id="evolution">
    			<label for="evolution" class="tabsLabel">Evolution</label>
					<ol class="tabsContent evolution"></ol>

    			<input type="radio" class="tabsRadio" name="tabs" id="moves">
    			<label for="moves" class="tabsLabel">Moves</label>
					<ol class="tabsContent moves"></ol>
			  </div>
      </div>
    </div>
  `;
};

const getMoveTypes = async (pokemon) => {
	const moveTypePromises = Object.values(pokemon.moves).map(async (moves) => {
		const moveDetails = await pokeApi.getMoveDetails(moves.move.url);
		return `<li class="move ${moveDetails.type.name}">${moves.move.name}</li>`;
	});

	const moveTypes = await Promise.all(moveTypePromises);
	return moveTypes.join("");
};

const loadPokemonDetails = async (url) => {
	try {
		const pokemon = await pokeApi.getPokemonDetails({ url });

		if (!pokemon) {
			throw new Error("Pokemon not found");
		}

		const pokemonDetails = await appendPokemonDetails(pokemon);
		pokemonDetailsPage.innerHTML += pokemonDetails;

		const pokemonMoveTypes = await getMoveTypes(pokemon);
		const pokemonMoveList = getElement(".moves");
		pokemonMoveList.innerHTML = pokemonMoveTypes;
	} catch (error) {
		console.log(error);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	const pokemonUrl = localStorage.getItem("pokemonUrl");
	loadPokemonDetails(pokemonUrl);
});
