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
    			<div class="tabsContent about">
						<p class="description">${pokemon.description}</p>
						<p class="height badge">Height: ${pokemon.height} m</p>
						<p class="weight badge">Weight: ${pokemon.weight} kg</p>
						<p class="habitat badge">Habitat: ${pokemon.habitat}</p>
					</div>

					<input type="radio" class="tabsRadio" name="tabs" id="stats">
    			<label for="stats" class="tabsLabel">Base Stats</label>
    			<ol class="tabsContent stats">
						${Object.entries(pokemon.stats)
							.map(
								([statName, value]) => `
  						<li class="badge">
    						<p class="statName">${statName.toUpperCase().replace("-", " ")}:</p>
								<p class="value"> ${value}</p>
    						<div class="progress-bar">
      						<div class="progress ${pokemon.type}" style="width: ${
										(value / 250) * 100
									}%"></div>
    						</div>
  						</li>
						`,
							)
							.join("")}
					</ol>

					<input type="radio" class="tabsRadio" name="tabs" id="evolution">
    			<label for="evolution" class="tabsLabel">Evolution</label>
					<ol class="tabsContent evolution">
						<p class="evolution">Feature not implemented</p>
					</ol>

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

		document.title = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

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
