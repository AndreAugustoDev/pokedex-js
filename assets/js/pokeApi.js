const pokeApi = {};

const convertPokeApiDetailToPokemon = (pokeDetail) => {
	const { id, name, types, sprites } = pokeDetail;
	const pokemon = new Pokemon();
	pokemon.number = id;
	pokemon.name = name;
	pokemon.types = types.map((typeSlot) => typeSlot.type.name);
	pokemon.type = pokemon.types[0];
	pokemon.sprite = sprites.other["official-artwork"].front_default;
	return pokemon;
};

pokeApi.getPokemonDetails = async (pokemon) => {
	const response = await fetch(pokemon.url);
	return convertPokeApiDetailToPokemon(await response.json());
};

pokeApi.getPokemon = async (offset = 0, limit = 10) => {
	const api = "https://pokeapi.co/api/v2/pokemon";
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
