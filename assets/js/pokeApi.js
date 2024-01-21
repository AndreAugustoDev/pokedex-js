const apiEndpoint = "https://pokeapi.co/api/v2";
const apiPokemon = `${apiEndpoint}/pokemon`;
const apiSpecie = `${apiEndpoint}/pokemon-species`;

const convertPokeApiDetailToPokemon = async (pokeDetail) => {
	const { id, name, types, sprites, moves, height, weight } = pokeDetail;

	const pokemon = new Pokemon();

	pokemon.id = id;
	pokemon.name = name;
	pokemon.types = types.map((typeSlot) => typeSlot.type.name);
	pokemon.type = pokemon.types[0];
	pokemon.sprite = sprites.other["official-artwork"].front_default;
	pokemon.url = `${apiPokemon}/${id}`;
	pokemon.moves = moves;
	pokemon.height = height / 10;
	pokemon.weight = weight / 10;

	const pokemonSpecieDetails = await getPokemonSpecieDetails(id);

	pokemon.habitat = pokemonSpecieDetails.habitat.name;
	pokemon.description = pokemonSpecieDetails.flavor_text_entries
		.find((entry) => entry.language.name === "en")
		.flavor_text.replace(/\f/g, " ")
		.replace("POKéMON", "POKÉMON");

	return pokemon;
};

const getPokemonDetails = async (pokemon) => {
	const response = await fetch(pokemon.url);
	return convertPokeApiDetailToPokemon(await response.json());
};

const getPokemonSpecieDetails = async (id) => {
	const url = `${apiSpecie}/${id}`;
	const response = await fetch(url);

	const data = await response.json();
	return data;
};

const getPokemon = async (offset = 0, limit = 10) => {
	const url = `${apiPokemon}?offset=${offset}&limit=${limit}`;
	try {
		const response = await fetch(url);
		const data = await response.json();

		const pokemon = data.results;
		const detailsRequest = pokemon.map(pokeApi.getPokemonDetails);

		const pokemonDetails = await Promise.all(detailsRequest);

		return pokemonDetails;
	} catch (error) {
		console.log(error);
	}
};

const getPokemonCount = async () => {
	const response = await fetch(apiPokemon);
	try {
		const data = await response.json();
		return data.count;
	} catch (error) {
		console.log(error);
	}
};

const getMoveDetails = async (url) => {
	const response = await fetch(url);
	try {
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

const pokeApi = {
	getPokemonDetails,
	getPokemon,
	getPokemonCount,
	getMoveDetails,
};
