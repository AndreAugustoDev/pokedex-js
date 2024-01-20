const pokeApi = {};

const convertPokeApiDetailToPokemon = (pokeDetail) => {
	const pokemon = new Pokemon();
	pokemon.number = pokeDetail.id;
	pokemon.name = pokeDetail.name;

	const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
	const [type] = types;

	pokemon.types = types;
	pokemon.type = type;

	pokemon.sprite = pokeDetail.sprites.other["official-artwork"].front_default;

	return pokemon;
};
pokeApi.getPokemonDetails = (pokemon) => {
	return fetch(pokemon.url)
		.then((response) => response.json())
		.then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 10) => {
	const api = "https://pokeapi.co/api/v2/pokemon";
	const url = `${api}?offset=${offset}&limit=${limit}`;

	return fetch(url)
		.then((response) => response.json())
		.then((data) => data.results)
		.then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
		.then((detailsRequest) => Promise.all(detailsRequest))
		.then((pokemonsDetails) => pokemonsDetails)
		.catch((error) => console.log(error));
};
