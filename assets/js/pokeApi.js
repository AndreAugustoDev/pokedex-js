const api = "https://pokeapi.co/api/v2/pokemon";

const convertPokeApiDetailToPokemon = (pokeDetail) => {
	const { id, name, types, sprites, moves } = pokeDetail;
	const pokemon = new Pokemon();
	pokemon.id = id;
	pokemon.name = name;
	pokemon.types = types.map((typeSlot) => typeSlot.type.name);
	pokemon.type = pokemon.types[0];
	pokemon.sprite = sprites.other["official-artwork"].front_default;
	pokemon.url = `${api}/${id}`;
	pokemon.moves = moves;
	return pokemon;
};

const getPokemonDetails = async (pokemon) => {
	const response = await fetch(pokemon.url);
	return convertPokeApiDetailToPokemon(await response.json());
};

const getPokemon = async (offset = 0, limit = 10) => {
	const url = `${api}?offset=${offset}&limit=${limit}`;
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
	const response = await fetch(api);
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
